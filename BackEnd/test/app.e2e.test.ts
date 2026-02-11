
import {describe,it,expect,beforeAll,afterAll} from 'vitest'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
// import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture:TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  })

  afterAll(async()=>{
    await app.close()
  })

  it('Get / should return Hello world!',async()=>{
    const res = await request(app.getHttpServer()).get('/')

    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World');
  })
});
