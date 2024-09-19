import supertest from 'supertest';
import { app } from '../app';
import { 
    createTestBook, 
    removeAllTestBooks, 
} from './test-utils';

describe('GET /library/books/available', () => {
    beforeEach(async () => {
        await createTestBook();
    });

    afterEach(async () => {
        await removeAllTestBooks();
    }); 

    it('should return available books', async () => {
        const result = await supertest(app)
            .get('/library/books/available')
            .expect(200);

        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].title).toBe('Test Book');
        expect(result.body[0].stock).toBeGreaterThan(0);
    });

    it('should return 404 if no books available', async () => {
        await removeAllTestBooks();
        
        const result = await supertest(app)
            .get('/library/books/available')
            .expect(404);

        expect(result.body.message).toBe('No available books found');
    });
});
