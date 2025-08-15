
function refreshToken(){
  const refresh=localStorage.getItem('refresh')
  
  return fetch('http://127.0.0.1:8000/api/token/refresh/',{
  method:'POST',
  headers:{
    'Content-Type':'application/json',
  },
  body:JSON.stringify(
    {
      'refresh':refresh
  
    }
  )
  
  
  }).then(res=>{
  if (!res.ok){
    throw new Error('failed to get token')
  }
  else{
    return res.json()
  }
  
  }).then(data=>{
  
  localStorage.setItem('access',data.access)
  return data.access
  }).catch((e)=>{
    throw new Error(e)
  })
  
  
  
  }
  
  function fetchWithauth(url,options={},retry=true){
    const accessToken=localStorage.getItem('access')
    options.headers={
      ...options.headers,
         "Authorization":"Bearer "+accessToken
    }
    return fetch(url,options).then(res=>{
    if(res.status==401 && retry){
     return refreshToken().then(data=>{
     options.headers["Authorization"]="Bearer "+data
      return fetchWithauth(url,options)
  
     })
    
    }
    else{
      return res
    }
    
  
  
  
    })
  }
  
















document.querySelector('.js-add').addEventListener('click',(e)=>{
e.preventDefault()


let date=document.querySelector('.js-date').value 
let  todo=document.querySelector('.js-todo').value


fetchWithauth("http://127.0.0.1:8000/api/add/",{
  method:'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({
  date:date,
  todo:todo
  })


}).then(res=>{
    if(!res.ok){
      throw new Error('Failed to add')
    }
    else{
      return res.json()
    }
  }).then(data=>{
  
    console.log(data.message)
    window.location.href='main.html'
   
  }).catch(e=>{
    console.log(e.message)
  })





})

