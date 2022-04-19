import React from 'react'


const h = () => 1111

console.log(React.createElement('div', null, 123))

/** @jsx h */
console.log(<div>afa</div>)