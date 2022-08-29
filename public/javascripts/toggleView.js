
(function () { 
    'use strict'
    const passwords = document.querySelectorAll('#password')
    const toggles= document.querySelectorAll('#toggle-password')

    Array.from(toggles)
        .forEach(function (toggle) {
            toggle.addEventListener("click", function (event){
                for(let password of passwords){
                        password.classList.toggle("visible");
                        if (this.checked) {
                                password.type ="text";
                          }else {
                            password.type = "password";
                        }
                   }
               })
        })      
})()
   

