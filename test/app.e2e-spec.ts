import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthService } from '../src/api/auth/auth.service';
import { AuthModule } from '../src/api/auth/auth.module';
import { getConnection } from 'typeorm';

describe('App e2e', () => {
  let app: INestApplication;
  let authService: AuthService;
  let token: any;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    app.listen('3333');
    pactum.request.setBaseUrl(process.env.BACKEND_URL);

    authService = app.get(AuthService);
    const user = {
      id: 1,
      publicAddress: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D',
    };
    token = await authService.verifyTest(user);
    token = token.token;
  });

  afterAll(async () => {
    const entities = getConnection().entityMetadatas;
    for (const entity of entities) {
      const repository = await getConnection().getRepository(entity.name);
      await repository.query(
        `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
      );
    }
    app.close();
  });

  describe('Add user', () => {
    it('Should add user', async () => {
      const dto = {
        publicAddress: '0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D',
        username: 'Username',
      };
      return pactum.spec().post(`/users`).withBody(dto).expectStatus(201);
    });
  });

  describe('Update user', () => {
    it('Should update user', async () => {
      const dto = {
        username: 'updated_username',
        bio: 'Bio',
        email: 'test@test.com',
        twitterLink: 'test.twitter.com',
        instagramLink: 'test.instagram.com',
        websiteLink: 'test.com',
      };
      return pactum
        .spec()
        .patch(`/users/0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D`)
        .withBody(dto)
        .withHeaders({
          Authorization: `Bearer ${token}`,
        })
        .expectStatus(200);
    });
  });

  describe('Get user by public address', () => {
    it('Should get user by public address', () => {
      return pactum
        .spec()
        .get(`/users/0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D`)
        .expectStatus(200);
    });
  });

  describe('Get user by id', () => {
    it('Should get user by id', () => {
      return pactum.spec().get(`/users/id/1`).expectStatus(200);
    });
  });

  describe('Get all users', () => {
    it('Should get all users', () => {
      return pactum.spec().get(`/users`).expectStatus(200);
    });
  });

  describe('Username check', () => {
    it('Should check username', () => {
      return pactum
        .spec()
        .get(`/users/checkUsername/updated_username`)
        .expectStatus(200)
        .expectBody({ exists: true });
    });
  });

  describe('Email check', () => {
    it('Should check email', () => {
      return pactum
        .spec()
        .get(`/users/checkEmail/test@test.com`)
        .expectStatus(200)
        .expectBody({ exists: true });
    });
  });

  describe('Delete user', () => {
    it('Should delete user', () => {
      return pactum
        .spec()
        .delete(`/users/0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D`)
        .expectStatus(200);
    });
  });

  describe('Get deleted user by public address', () => {
    it('Should throw 404 error', () => {
      return pactum
        .spec()
        .get(`/users/0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D`)
        .expectStatus(404);
    });
  });

  describe('Restore user', () => {
    it('Should restore user', () => {
      return pactum
        .spec()
        .get(`/users/restore/0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D`)
        .expectStatus(200);
    });
  });

  describe('Get restored user by public address', () => {
    it('Should get restored user by public address', () => {
      return pactum
        .spec()
        .get(`/users/0xa76B6373406a8E8C367d4fd5e9E70aF36536A10D`)
        .expectStatus(200);
    });
  });

  describe('Upload profile picture', () => {
    it('Should upload profile picture', () => {
      return pactum
        .spec()
        .withHeaders({
          Authorization: `Bearer ${token}`,
        })
        .withFile(`${__dirname}/mockData/test.jpg`, { filename: 'content' })
        .post(`/users/upload/profileImage`)
        .expectStatus(201);
    });
  });

  describe('Delete profile picture', () => {
    it('Should delete profile picture', () => {
      return pactum
        .spec()
        .withHeaders({
          Authorization: `Bearer ${token}`,
        })
        .delete(`/users/delete/profileImage`)
        .expectStatus(200);
    });
  });

  describe('Add blockchain type', () => {
    it('Should add blockchain type', () => {
      return pactum
        .spec()
        .post(`/nfts/blockchainTypes/Etherium`)
        .expectStatus(201);
    });
  });

  describe('Get all blockchain types', () => {
    it('Should get all blockchain types', () => {
      return pactum.spec().get(`/nfts/blockchainTypes/all`).expectStatus(200);
    });
  });
  let nftMedia;
  describe('Upload nft media', () => {
    it('Should upload nft media', async () => {
      nftMedia = await pactum
        .spec()
        .withHeaders({
          Authorization: `Bearer ${token}`,
        })
        .withFile('content', `${__dirname}/mockData/test.jpg`)
        .post(`/nfts/upload/media`)
        .expectStatus(201)
        .returns((ctx) => {
          return ctx.res.body;
        });
    });
  });

  describe('Add NFT', () => {
    it('Should add NFT', () => {
      const dto = {
        name: 'test',
        fileName: nftMedia,
        description: 'test descr',
        blockchainTypeId: 1,
        isAssetBacked: true,
        properties: [
          { name: 'smth', type: 'red', id: 'dasf' },
          { name: 'smth', type: 'adfsf', id: 'dasf' },
        ],
        stats: [
          {
            name: 'Speed',
            nftValue: 3,
            maxValue: 5,
            id: 'smth',
          },
          {
            name: 'Speed',
            nftValue: 3,
            maxValue: 5,
            id: 'smth',
          },
        ],
        levels: [
          {
            name: 'Speed',
            nftValue: 3,
            maxValue: 5,
            id: '7c573160-4dc6-4805-871b-16041ae6fefa',
          },
        ],
        isSensitiveContent: true,
      };
      return pactum
        .spec()
        .post(`/nfts`)
        .withBody(dto)
        .withHeaders({
          Authorization: `Bearer ${token}`,
        })
        .expectStatus(201);
    });
  });
  describe('Get nft by id', () => {
    it('Should get nft by id', () => {
      return pactum.spec().get(`/nfts/1`).expectStatus(200);
    });
  });
});
