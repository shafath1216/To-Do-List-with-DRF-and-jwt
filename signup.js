document.querySelector('.js-signup').addEventListener('click',async(e)=>{
e.preventDefault()
username=document.querySelector('.js-username').value 
password=document.querySelector('.js-password').value
console.log(username)
console.log(password)
try{
const res=await fetch('http://127.0.0.1:8000/api/auth/register/',{
method:"POST",
headers:{
  "Content-Type":"application/json"
},
body:JSON.stringify({
  username:username,
  password:password
})
})
if(!res.ok){
    const errorData = await res.json();
    console.error("Registration error:", errorData);
    alert("Registration failed: " + JSON.stringify(errorData));
    
 
 
  throw new Error('Error in registration')

}
else{
  data=await res.json()
  console.log(data)
  localStorage.setItem('refresh',data.refresh)
  localStorage.setItem('access',data.access)
  window.location.href='landing.html'
}

}
catch(e){
  alert("error"+e.message)
}

})

