let appform = document.body.querySelector("#applynow")
let temp1=0;

appform.addEventListener("click" , ()=>{
    if(temp1===0){
        document.body.querySelector("#applyform").style.display="block";
        appform.innerText = "Cancel";
        temp1=-1;
    }
    else{
        document.body.querySelector("#applyform").style.display="none";
        appform.innerText = "Apply";
        temp1=0;
    }
})