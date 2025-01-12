import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';

describe('Auth and User Log E2E Test', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login and return access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'rafa',
        password: 'rafa1234',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();

    accessToken = response.body.data.token;
  });

  it('should fail to access /user/log without token', async () => {
    const response = await request(app.getHttpServer()).get('/user/log');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should access /user/log with valid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/log')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});
