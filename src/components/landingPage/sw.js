self.addEventListener('sync', function(event) {
  alert('sasa')
  if (event.tag == 'myFirstSync') {
    event.waitUntil(doSomeStuff());
  }
});

doSomeStuff = () =>{
  return new Promise((resolve, rej)=>{
      return resolve(true);
    })
  })
}
