
//------------------mentors list popup links---------------------
function responsiveNess(device) {
	if (device.matches) {
		let resp=document.getElementsByClassName("mentor_link");
		for(var u=0;u< resp.length;u++){
			resp[u].setAttribute('href', "#");
			}
	} 
  }
  
  var device = window.matchMedia("(min-width: 1000px)")
  responsiveNess(device) 
  device.addListener(responsiveNess) 
//------------------mentors list popup links---------------------

//----filter code-----------------------------------------

var filtering =(text_id, table_id)=> {
  var input, filter, table, tr, td, i, txtValue1, txtValue2;
  input = document.getElementById(text_id);
  filter = input.value.toUpperCase();
  table = document.getElementById(table_id);
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");

    for (var t = 0; t < td.length; t++) {
      if (td[t]) {
        txtValue1 = td[t].textContent || td[t].innerText;
        txtValue2 = td[++t].textContent || td[++t].innerText;

        if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        } else {
          tr[i].style.display = "none";
          break;
        }
      }
    }
  }
}
/// end of filter code

// ------scoring a mentor session start--------------------
 let staring= myaImg =>{
  myaImg.src="../Assets/Icons/scored_star.png";
 console.log(myaImg.getAttribute("data-rate"));
 }

 // ------scoring a mentor session end--------------------


///----phone menu--------------------------------------------

let myFunction=()=> {
  var x = document.getElementById("phone_menu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
///----phone menu--------------------------------------------

//------------------conformation box -------------------------
let message= (message,Mycolor) =>{
	if(modal){modal.style.display = "none";}
	const message_box=document.getElementsByClassName("message_box");
	if(Mycolor==='red'){
		message_box[0].style.backgroundColor="rgba(199,85,87,1)"; 
		document.getElementsByClassName("message_body")[0].style.color="white"; 
	}else{
		
		message_box[0].style.backgroundColor="#F2865E"; 
		document.getElementsByClassName("message_body")[0].style.color="white"; 
	}
	
	document.getElementsByClassName("message_body")[0].innerHTML=" "+message+" ";
	document.getElementsByClassName("message_box")[0].style.display='inherit';
	setTimeout(()=>message_box[0].style.display='none',2000);
  
}
		let close_message=()=>{
		document.getElementsByClassName("message_box")[0].style.display='none';	
		}
//------------------conformation box -------------------------

// ---------------------------signup validate------------------

var validate_form= text =>{
let textFild=document.getElementsByClassName(text);
for(let i=0;i<textFild.length;i++){
  var textName=textFild[i].getAttribute("data-name");
 if(textFild[i].value ===""){message('fill '+textName+' fild please! ','red'); break;}
 

}
	
if(textFild[i].value !== textFild[4].value)
 {message('password not match !!','red'); break;}
	else{
	 window.location.href("../html/users_welcome_page.html");	
	}
	
}



// ---------------------------signup validate------------------


//------------signIn privelege  control code-------------------

let prvilegeControl=()=>{

	var login_data=document.getElementsByClassName("signUpform");
	
	if(login_data[0].value == "admin@gmail.com" && login_data[1].value == "admin" )
		{
		window.location.href='admin_welcome_page.html';	
		}else if(login_data[0].value == "mentor@gmail.com" && login_data[1].value == "mentor" ){
		window.location.href='mentors_welcome_page.html';
		}else if(login_data[0].value == "mentee@gmail.com" && login_data[1].value == "mentee" ){
		window.location.href='users_welcome_page.html';
		}else{
			document.getElementById("login_notification").innerHTML='<span id="login_notification_text">Incorect user name or password</span>';
		}
		
}

//------------signIn privelege  control code-------------------

//---------------session validate----------------------------
let session_validate=()=>{
	document.getElementById("create_sesion_message").innerHTML='<span id="login_notification_text">type you question please !</span>';
	
}
//---------------session validate----------------------------

// ---signIn modal start-----------------------------
var modal = document.getElementById("login_myModal");
var btn = document.getElementById("signin");

var closebtn = document.getElementsByClassName("login_close")[0];

var mentorPop=document.getElementsByClassName("add_session");
 // reject button

for(var mentor=0;mentor<mentorPop.length;mentor++){
mentorPop[mentor].addEventListener('click',function(){
	modal.style.display = "block";
});
}
closebtn.addEventListener('click',function(){
	modal.style.display = "none";
});

btn.addEventListener('click',function(){
	modal.style.display = "block";
});
window.addEventListener('click',function(event){
	if (event.target == modal) {
		modal.style.display = "none";
	  }
});




/////-----------------signIn modal end-----------------------------*/