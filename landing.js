document.querySelector('.js-signup').addEventListener('click',(e)=>{
e.preventDefault()

window.location.href='signup.html'

})

document.querySelector('.js-login').addEventListener('click',async(e)=>{
e.preventDefault()
const username=document.querySelector('.js-username').value 
const password=document.querySelector('.js-password').value
try{
res=await fetch('http://127.0.0.1:8000/api/token/',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
username:username,
password:password
})
})
if(!res.ok){
  errData=await res.json()
  alert("error: "+JSON.stringify(errData))
  throw new Error('login failed')
}

else{
data=await res.json()

localStorage.setItem('access',data.access)
localStorage.setItem('refresh',data.refresh)
localStorage.setItem('username',username)
console.log('username')
console.log('logged in ')
window.location.href='main.html'

}
}
catch(e){

  alert("Error: "+e.message)
}





})