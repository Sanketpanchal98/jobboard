let hiform = document.body.querySelector("#create")
let temp=0;

hiform.addEventListener("click" , ()=>{
    if(temp===0){
        document.body.querySelector("#createjob").style.display="block";
        hiform.innerText = "Cancel";
        temp=-1;
    }
    else{
        document.body.querySelector("#createjob").style.display="none";
        hiform.innerText = "Create";
        temp=0;
    }
})

