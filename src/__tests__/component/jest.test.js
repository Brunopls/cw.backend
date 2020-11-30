test('Jest is using the test DB', ()=> {
    expect(process.env.DB_DATABASE).toBe('test-wesellhousesDB');
})
