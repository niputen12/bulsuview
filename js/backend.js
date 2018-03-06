$(document).ready(function(){
  $('.form-signin').submit(function(e){
    signin();
    e.preventDefault();
  });
  $('.sign-up-form').submit(function(e){
    signup();
    e.preventDefault();
  });
  $('.post-form').submit(function(e){
    post();
    e.preventDefault();
  })
})
  $('.code').click(function(){
    verify();
  })
//SIGNUP
function signup(){
  var local = 'http://localhost:4000';
  var deploy = 'https://bulsu.herokuapp.com';
  $.ajax({
     url: deploy+'/api/users',
     type: 'POST',
     data: {
       user: {
         firstname: $('.firstname').val(),
         lastname:  $('.lastname').val(),
         email: $('.email').val(),
         username: $('.username').val(),
         password: $('.password').val(),
       }
      },
     success: function(res) {
       alert("Success");
       localStorage.setItem("email", $('.email').val());
       //location.href = "home.html";

     },
     error : function(res) {
       alert(res.responseText);
     }
       });
}
//SIGNIN
function signin(){
  var local = 'http://localhost:4000';
  var deploy = 'https://bulsu.herokuapp.com';
  $.ajax({
    url: deploy+'/api/login',
    type: 'POST',
    data: {
        username: $('.username').val(),
        password: $('.password').val()
    },
    success: function(res){
      console.log('Success',res);
      try{
        if(res.errors[0].detail == "Account not verified"){
          $('#myModal').modal(open);

          $.ajax({
              url: deploy+'/api/users/'+$('.username').val(),
              type: 'GET',
              success: function(res){
                $(".email").text(res.data.email);
                // localStorage.setItem("email", res.data.email);
              },
              error: function(res){
                console.log(res);
              }
          });
        }
      }catch(err){

      }finally {
        localStorage.setItem("posts", res.data.posts);
        console.log(localStorage.getItem("posts"));
        localStorage.setItem("token", res.data.meta.token);
        localStorage.setItem("username", res.data.username);
        location.href = 'homepage.html';
      }
    },
    error : function(res){
      console.log('Error',res);
      if(res.status == 500) {

        alert("username or password is incorrect")
      }
    }

  });
}
//HOMEPAGE
function post(){
  var local = 'http://localhost:4000';
  var deploy = 'https://bulsu.herokuapp.com';
  $.ajax({
    url: deploy+'/api/posts',
    headers: {
       "Authorization":"Bearer "+localStorage.getItem("token")
    },
    type: 'POST',
    data: {
      post: {
        body:$('.post').val()
      }
    },
    success: function(res){
      console.log('S');
      alert('Success');
    },
    error: function(res){
      console.log('E');
      alert('Error');
    }
  });
}
//POSTS
function show(){
  var local = 'http://localhost:4000';
  var deploy = 'https://bulsu.herokuapp.com';
  if(localStorage.getItem("token") === null){
    alert('Please Log In to continue');
    location.href = 'home.html';
  }else{
    $.ajax({
        url: deploy+'/api/posts',
        headers: {
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        type: 'GET',
        success: function(res){
          set_posts(res);
        },
        error: function(res){
          console.log(res);
        }
    });
  }
}
function set_posts(res){
  $.each(res.data, function(i, d){
      $('.af').append(
      '<hr>'+
      '<div class="media">'+
        '<div class="media-left">' +
          '<img src="/home/joshua/Desktop/static_bulsu/images/bulsulogo.png" class="media-object" style="width:90px; margin-right: 10px;">'+
        '</div>'+
        '<div class ="media-body">'+
          '<h4 class="media-heading">'+d.user.firstname +' '+ d.user.lastname +' '+ d.inserted_at+'</h4>'+
          '<p>'+d.body+'</p>'+
        '</div>'+
      '</div>');
     });
}
function reset(){
  localStorage.clear();
}
