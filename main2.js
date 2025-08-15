const username= localStorage.getItem('username')
document.querySelector('.js-heading').innerHTML=`Welcome ${username} !`


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

document.querySelector('.js-logout').addEventListener('click',(e)=>{
  
  const refresh=localStorage.getItem('refresh')
  fetch('http://127.0.0.1:8000/api/auth/logout/',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      refresh:refresh,
    })
  }).then(res=>{
    if(!res.ok){
      throw new Error('logout failed1')
    }else{
      return res.json()
    }
  }).then(data=>{
    console.log(data.message)
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    window.location.href='landing.html'
  })
 


})







document.querySelector('.js-date').addEventListener('change', rendertodolist);


function rendertodolist(){

const date=document.querySelector('.js-date').value

if (date===''){
fetchWithauth("http://127.0.0.1:8000/api/get/",{
  method:'GET',
  headers:{
    'Content-Type':'application/json'
  }}).then(res=>{
    if(!res.ok){
      throw new Error('Failed to fetch')
    }
    else{
      return res.json()
    }
  }).then(data=>{

   let innerHTML=''
   data.forEach(item=>{
    const datetimeString =item.date;  // exactly what user entered

    // Just convert the format manually, no Date parsing
    const [datePart, timePart] = datetimeString.split('T');
    const [year, month, day] = datePart.split('-');
    let [hours, minutes] = timePart.split(':');
    
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    
    const formatted = `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
   
   
    innerHTML+=
   `<tr><td>${formatted}</td><td colspan="4">${item.todo}</td><td>  <a  data-id="${item.id}"  data-date="${item.date}" data-todo= "${item.todo}"  class="text-white  inline-block js-edit text-2xl transform hover:scale-150 transition duration-300" style="font-family: 'Fredoka One'">
  Edit</a></td><td>  <a data-id="${item.id}" class="text-white text-2xl js-delete inline-block transform hover:scale-150 transition duration-300 " style="font-family: 'Fredoka One'" >Delete</a></td>  </tr> `
  })

  document.querySelector('.js-tbody').innerHTML=innerHTML
  document.querySelectorAll('.js-delete').forEach(del=>{
  del.addEventListener('click',(e)=>{
   const id=del.dataset.id
   console.log(id)
   fetchWithauth(`http://127.0.0.1:8000/api/delete/${id}/`,{
   method:'DELETE',
   headers:{
    'Content-Type':'application/json'
   },
   body:JSON.stringify({
   id:id
   })
   }).then(res=>{
   if(!res.ok){
    throw new Error('failed to delete')
   } else{
    return res.json()
   }

   }).then(data=>{
    console.log(data.message)
    rendertodolist() 
  }).catch(e=>{
    console.log(e)
  })
  



  })



  })
  

  document.querySelectorAll('.js-edit').forEach((ed)=>{
    ed.addEventListener('click',(e)=>{
    console.log('click')
    localStorage.setItem('date',ed.dataset.date)
    localStorage.setItem('todo',ed.dataset.todo)
    localStorage.setItem('id',ed.dataset.id)    
    
    window.location.href='edit.html'
  })
    
    })






}
  ).catch(e=>{
    console.log(e.message)
  })

}
  







  

















else{
  fetchWithauth(`http://127.0.0.1:8000/api/search/?date=${date}`,{
    method:'GET',
    headers:{
      'Content-Type':'application/json'
    }}).then(res=>{
      if(!res.ok){
        throw new Error('Failed to fetch')
      }
      else{
        return res.json()
      }
    }).then(data=>{
  
     let innerHTML=''
     data.forEach(item=>{
      const datetimeString =item.date;  // exactly what user entered
  
      // Just convert the format manually, no Date parsing
      const [datePart, timePart] = datetimeString.split('T');
      const [year, month, day] = datePart.split('-');
      let [hours, minutes] = timePart.split(':');
      
      hours = parseInt(hours, 10);
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      
      const formatted = `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
     
     
      innerHTML+=
     `<tr><td>${formatted}</td><td colspan="4">${item.todo}</td><td>  <a  data-id="${item.id}"  data-date="${item.date}" data-todo= "${item.todo}"  class="text-white  inline-block js-edit text-2xl transform hover:scale-150 transition duration-300" style="font-family: 'Fredoka One'">
    Edit</a></td><td>  <a data-id="${item.id}" class="text-white text-2xl js-delete inline-block transform hover:scale-150 transition duration-300 " style="font-family: 'Fredoka One'" >Delete</a></td>  </tr> `
    })
  
    document.querySelector('.js-tbody').innerHTML=innerHTML
    document.querySelectorAll('.js-delete').forEach(del=>{
    del.addEventListener('click',(e)=>{
     const id=del.dataset.id
     console.log(id)
     fetchWithauth(`http://127.0.0.1:8000/api/delete/${id}/`,{
     method:'DELETE',
     headers:{
      'Content-Type':'application/json'
     },
     body:JSON.stringify({
     id:id
     })
     }).then(res=>{
     if(!res.ok){
      throw new Error('failed to delete')
     } else{
      return res.json()
     }
  
     }).then(data=>{
      console.log(data.message)
      rendertodolist() 
    }).catch(e=>{
      console.log(e)
    })
    
  
  
  
    })
  
  
  
    })
    
  
    document.querySelectorAll('.js-edit').forEach((ed)=>{
      ed.addEventListener('click',(e)=>{
      console.log('click')
      localStorage.setItem('date',ed.dataset.date)
      localStorage.setItem('todo',ed.dataset.todo)
      localStorage.setItem('id',ed.dataset.id)    
      
      window.location.href='edit.html'
    })
      
      })
  
  
  
  
  
  
  }
    ).catch(e=>{
      console.log(e.message)
    })
  
  
    
  





  }





}

rendertodolist()