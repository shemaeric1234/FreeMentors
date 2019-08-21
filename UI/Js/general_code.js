// ---signIn modal start-----------------------------
var modal = document.getElementById("login_myModal");
var btn = document.getElementById("signin");

var closebtn = document.getElementsByClassName("login_close")[0];

 // reject button

 
btn.onclick = function() {
  modal.style.display = "block";
}

closebtn.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
/////-----------------signIn modal end-----------------------------*/


//----filter code-----------------------------------------

let filtering=(text_id,table_id)=>{
  var input, filter, table, tr, td, i, txtValue1,txtValue2;
  input = document.getElementById(text_id);
  filter = input.value.toUpperCase();
  table = document.getElementById(table_id);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for(let t = 0;t < td.length;t++){
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
let message= (message) =>{
	
    modal.style.display = "none";
	const message_box1=document.getElementsByClassName("message_box");
	
	document.getElementsByClassName("message_body")[0].innerHTML=" "+message+" ";
	document.getElementsByClassName("message_box")[0].style.display='inherit';
	const message_box=document.getElementsByClassName("message_box");
	setTimeout(()=>message_box[0].style.display='none',2500);
       
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
 if(textFild[i].value ===""){message('fill '+textName+' fild please! '); break;}
 else if(textFild[3].value !== textFild[4].value)
 {message('password not match !!'); break;}
 window.location.href("../html/users_welcome_page.html");
}
}



// ---------------------------signup validate------------------


//------------signIn privelege  control code-------------------

let prvilegeControl=()=>{
	if(/index/.test(window.location.pathname)){
	var login_data=document.getElementsByClassName("signUpform_login");
	
	if(login_data[0].value == "admin@gmail.com" && login_data[1].value == "admin" )
		{
		window.location.href='html/admin_welcome_page.html';	
		}else if(login_data[0].value == "mentor@gmail.com" && login_data[1].value == "mentor" ){
		window.location.href='html/mentors_welcome_page.html';
		}else if(login_data[0].value == "mentee@gmail.com" && login_data[1].value == "mentee" ){
		window.location.href='html/users_welcome_page.html';
		}else{
			document.getElementById("login_notification").innerHTML='<span id="login_notification_text">Incorect user name or password</span>';
		}
		}else{
			var login_data=document.getElementsByClassName("signUpform_login");
	
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
}

//------------signIn privelege  control code-------------------

//---------------session validate----------------------------
let session_validate=()=>{
	document.getElementById("create_sesion_message").innerHTML='<span id="login_notification_text">type you question please !</span>';
	
}
//---------------session validate----------------------------