//learning tests completely newly
const request = require('supertest');
const app = require('../../app');

//example data for post request
const exampleData = {
    launchDate: "January 6, 2900",
    mission: "Falcon Rave 634",
    target: "Kepler-186 f",
    rocket: "Serengeti MobileHawk"
};

const exampleDataWithoutDate = {
    mission: "Falcon Rave 634",
    target: "Kepler-186 f",
    rocket: "Serengeti MobileHawk"
};

const exampleDataWithInvalidDate = {
    launchDate: "section",
    mission: "Falcon Rave 634",
    target: "Kepler-186 f",
    rocket: "Serengeti MobileHawk"
}



//first define a test case
describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app).get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
});

describe('Test POST /launch', () => {
    test('It should respond with 201 success', async () => {
        const response = await request(app)
            .post('/launches')
            .send(exampleData)
            .expect('Content-Type', /json/)
            .expect(201);
        
        //to handle the date
        const requestDate = new Date(exampleData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(responseDate).toBe(requestDate);

        //to make sure request without date matches up
        expect(response.body).toMatchObject(exampleDataWithoutDate);
        
    })

    test('it should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(exampleDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'missing required launch property',
        })
    })

    test('it should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(exampleDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid Date',
        })
    })
})