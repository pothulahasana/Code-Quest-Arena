function checkLogin(){
                var user =document.getElementById("uname").value;
                var pass=document.getElementById("pwd").value;
                if(user=="Maneesha" && pass=="1234"){
                    alert("Login Successful");
                }
                else{
                    alert("Invalid Username or Password");
                }
            }