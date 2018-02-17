// IE11 may return an undefined descriptor, but it supports Function#name
const func = function unnamed() {};
const nameDescriptor = Object.getOwnPropertyDescriptor(func, 'name');
// This condition is true in modern browsers that implement Function#name properly
const canConfigureName = !nameDescriptor || nameDescriptor.configurable;

export default canConfigureName;
