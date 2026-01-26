import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../src/app";
import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.AUTH;

describe("Testing API Auth", () => {
    const secret = process.env.JWT_SECRET || "hash-md5-test";

    const validToken = jwt.sign(
        {
            idUser: 1,
            role: "member",
            idBrandMaster: 1,
        },
        secret,
        { expiresIn: "1h" }
    );

    describe("refreshToken", () => {
        it("should return a new token when user exists and is active", async () => {
            const userMock = {
                idUser: 1,
                username: "testuser",
                email: "test@example.com",
                isActive: true,
                role: "member",
                idBrandMaster: 1,
                lastLoginDate: new Date(),
            };

            // mock do usuário encontrado pelo AuthService
            prismaMock.user.findUnique.mockResolvedValue(userMock as any);

            // mock da atualização do lastLoginDate (ou algo similar)
            prismaMock.user.update.mockResolvedValue(userMock as any);

            const res = await request(app)
                .get(`${BASE_PATH}/token/1`)
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.status).toBe(200);

            // contrato esperado da API
            expect(res.body).toHaveProperty("token");
            expect(typeof res.body.token).toBe("string");
        });

        it("should return 401 or 403 if token is invalid", async () => {
            const res = await request(app)
                .get(`${BASE_PATH}/token/1`)
                .set("Authorization", "Bearer invalid_token");

            expect(res.status).not.toBe(200);
        });
    });
});
