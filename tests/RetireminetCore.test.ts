import RetirementCore from '../src/core/RetirementCore';



test('test() returns 42', ()=>{
  const rc = new RetirementCore();
  expect(rc.test()).toBe(42);
});