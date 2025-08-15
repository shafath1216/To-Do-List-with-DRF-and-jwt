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

let datetime = localStorage.getItem('date'); // e.g., "2025-08-13T12:07:00Z"

// remove 'Z' if present
datetime = datetime.replace('Z', '');

// trim seconds if needed
datetime = datetime.slice(0,16); // "2025-08-13T12:07"

document.querySelector('.js-date').value = datetime;
document.querySelector('.js-todo').value=localStorage.getItem('todo')



document.querySelector('.js-add').addEventListener('click',(e)=>{
  e.preventDefault()
  
  
  let date=document.querySelector('.js-date').value 
  let  todo=document.querySelector('.js-todo').value
  let id=localStorage.getItem('id')
  
  
  fetchWithauth(`http://127.0.0.1:8000/api/edit/${id}/`,{
    method:'PATCH',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
    date:date,
    todo:todo
    })
  
  
  }).then(res=>{
      if(!res.ok){
        throw new Error('Failed to edit')
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