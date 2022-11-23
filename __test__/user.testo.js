const filterObj = require('../controllers/userController')

       test('I want to test that it returns me an obj', () => {
            obj = { role:'admin'}
            const array = ['admin']
            const newObj = {};

            expect(filterObj.filterObj(obj, array)).toBe(newObj)
       })
