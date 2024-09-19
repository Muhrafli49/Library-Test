import supertest from 'supertest';
import { app } from '../app';
import {
    createTestBook,
    removeAllTestBooks,
    createTestMember,
    removeAllTestMembers,
    borrowBookForMember,
    returnBookForMember
} from './test-utils';

describe('POST /library/member/borrow - Borrow Book', () => {
    let testBook;
    let testMember;

    beforeEach(async () => {
        await removeAllTestBooks();
        await removeAllTestMembers();
        testBook = await createTestBook();
        testMember = await createTestMember();
    });

    afterEach(async () => {
        await removeAllTestBooks();
        await removeAllTestMembers();
    });

    it('should borrow a book successfully', async () => {
        const result = await supertest(app)
            .post('/library/member/borrow')
            .send({
                bookId: testBook._id,
                memberId: testMember._id
            })
            .expect(200);

        expect(result.body.status).toBe('success');
        expect(result.body.message).toBe('Buku berhasil dipinjam');
        expect(result.body.data._id).toBe(testMember._id.toString());
        expect(result.body.data.borrowedBooks.length).toBe(1);
        expect(result.body.data.borrowedBooks[0].book).toBe(testBook._id.toString());
        expect(result.body.data.penalty).toBe(false);
        expect(result.body.data.penaltyEndDate).toBeNull();
    });

    it('should return 400 if member has already borrowed 2 books', async () => {
        await borrowBookForMember(testMember._id, testBook._id);
        await borrowBookForMember(testMember._id, testBook._id); // Borrow 2 books

        const result = await supertest(app)
            .post('/library/member/borrow')
            .send({
                bookId: testBook._id,
                memberId: testMember._id
            })
            .expect(400);

        expect(result.body.status).toBe('error');
        expect(result.body.message).toBe('Member has already borrowed 2 books');
    });

    it('should return 404 if book is not found', async () => {
        const result = await supertest(app)
            .post('/library/member/borrow')
            .send({
                bookId: 'nonexistentBookId',
                memberId: testMember._id
            })
            .expect(404);

        expect(result.body.status).toBe('error');
        expect(result.body.message).toBe('Book not found');
    });

    it('should return 404 if member is not found', async () => {
        const result = await supertest(app)
            .post('/library/member/borrow')
            .send({
                bookId: testBook._id,
                memberId: 'nonexistentMemberId'
            })
            .expect(404);

        expect(result.body.status).toBe('error');
        expect(result.body.message).toBe('Member not found');
    });
});

describe('POST /library/member/return - Return Book', () => {
    let testBook;
    let testMember;

    beforeEach(async () => {
        await removeAllTestBooks();
        await removeAllTestMembers();
        testBook = await createTestBook();
        testMember = await createTestMember();
        await borrowBookForMember(testMember._id, testBook._id);
    });

    afterEach(async () => {
        await removeAllTestBooks();
        await removeAllTestMembers();
    });

    it('should return a book successfully', async () => {
        const result = await supertest(app)
            .post('/library/member/return')
            .send({
                bookId: testBook._id,
                memberId: testMember._id
            })
            .expect(200);

        expect(result.body.status).toBe('success');
        expect(result.body.message).toBe('Buku berhasil dikembalikan');
        expect(result.body.data.member._id).toBe(testMember._id.toString());
        expect(result.body.data.member.borrowedBooks.length).toBe(0);
        expect(result.body.data.returnedBook.code).toBe(testBook.code);
        expect(result.body.data.returnedBook.title).toBe(testBook.title);
    });

    it('should apply penalty if book is returned late', async () => {
        // Set return date to be 8 days after the borrow date
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 8);

        const result = await supertest(app)
            .post('/library/member/return')
            .send({
                bookId: testBook._id,
                memberId: testMember._id,
                returnDate: returnDate.toISOString()
            })
            .expect(200);

        expect(result.body.status).toBe('success');
        expect(result.body.message).toBe('Buku berhasil dikembalikan');
        expect(result.body.data.member.penalty).toBe(true);
        expect(result.body.data.member.penaltyEndDate).toBeDefined();
    });

    it('should return 404 if book is not found', async () => {
        const result = await supertest(app)
            .post('/library/member/return')
            .send({
                bookId: 'nonexistentBookId',
                memberId: testMember._id
            })
            .expect(404);

        expect(result.body.status).toBe('error');
        expect(result.body.message).toBe('Book not found');
    });

    it('should return 404 if member is not found', async () => {
        const result = await supertest(app)
            .post('/library/member/return')
            .send({
                bookId: testBook._id,
                memberId: 'nonexistentMemberId'
            })
            .expect(404);

        expect(result.body.status).toBe('error');
        expect(result.body.message).toBe('Member not found');
    });

    it('should return 400 if book was not borrowed by member', async () => {
        const newBook = await createTestBook("TW-12", "New Twilight");
        const result = await supertest(app)
            .post('/library/member/return')
            .send({
                bookId: newBook._id,
                memberId: testMember._id
            })
            .expect(400);

        expect(result.body.status).toBe('error');
        expect(result.body.message).toBe('Book not borrowed by this member');
    });
});
