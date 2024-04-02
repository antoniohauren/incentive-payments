import A from 'node:assert';
import T from 'node:test';
import { HashService } from './hash-service';


T.describe("hash-service", () => {
    let sut: HashService;

    T.before(() => {
        sut = new HashService();
    })

    T.it("should generate salt", () => {
        const response = sut.generateSalt();
        
        A.equal(response.length, 32);
        A.equal(typeof response, 'string');
    })

    T.it("should generate hash", () => {
        const input = "test"
        const response = sut.generateHash(input, "salt");

        A.equal(response.length, 128);
        A.equal(typeof response, 'string')
    })

    T.it("should return true if valid hash", () => {
        const salt = sut.generateSalt();
        const hash = sut.generateHash("test", salt);

        const response = sut.isValidHash("test", salt, hash);

        A.equal(response, true);
    })

    T.it("should return false if invalid hash", () => {
        const salt = sut.generateSalt();
        const hash = sut.generateHash("invalid", salt);

        const response = sut.isValidHash("test", salt, hash);

        A.equal(response, false);
    })
})