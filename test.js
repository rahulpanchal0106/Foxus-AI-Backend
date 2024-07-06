//find smallest
array=['aaaa','bb','ccccccc','ddd','a'];
var smallest_el="";
var min=10000;
array.map((el)=>{
	if(el.length<min){
        min=el.length;
		smallest_el=el;
	}
})

console.log(smallest_el);

//find function
users=[];
function check(user.age>25){
    return user;
}
users.find(check);

//true or false
console.log(null===undefined)