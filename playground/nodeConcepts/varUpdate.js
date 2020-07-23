function foo (arr) {
    console.log(arr);
    setTimeout(() => {console.log(arr);}, 1300);
}

let arr = [];
foo(arr);
arr.push(0);

/*
    In JS, objects and arrays are passed by reference, so any update in the array
    automatically gets reflected in the function.
    This will be used to create a global state determining the status of pieces.
*/