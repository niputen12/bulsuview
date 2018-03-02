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
       console.log('s',res);

     },
     error : function(res) {
       console.log('e',res);
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
        location.href = 'homepage.html';
        localStorage.setItem("posts", res.data.posts);
        console.log(localStorage.getItem("posts"));
        localStorage.setItem("token", res.data.meta.token);
        localStorage.setItem("username", res.data.username);
    },
    error : function(res){
      console.log('Error',res);
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
      $('.af').append('<h3 class="'+d.id+'">'+ "Date Created: "+ d.inserted_at +" by: "+d.user.firstname+" "+d.user.lastname+ "<br>" + d.body +'</h3>');
     });
}
function reset(){
  localStorage.clear();
}
