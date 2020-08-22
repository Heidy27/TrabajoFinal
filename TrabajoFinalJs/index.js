const firebaseConfig = {
    apiKey: "AIzaSyBDm9Vcbb5O1GP8VQzmOjwGGGQOTOhWkSY",
    authDomain: "instagram-71f41.firebaseapp.com",
    databaseURL: "https://instagram-71f41.firebaseio.com",
    projectId: "instagram-71f41",
    storageBucket: "instagram-71f41.appspot.com",
    messagingSenderId: "45574392652",
    appId: "1:45574392652:web:63a8a1b32203cc28591de9"
  };
  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore();

  var con = firebase.database().ref('users')

  document.getElementById("form").addEventListener("submit", (e) =>{
    e.preventDefault();

    var userInfo = con.push();
    userInfo.set({
      name: getId("name"),
      number: getId("number"),
      email: getId("email"),
      city: getId("city"),
      password: getId("password")
    });
    alert("Registrado");
    console.log("Registrado");
    document.getElementById("form").reset();

  });

  function abrirInicio(){
  window.onload = abrirInicio;

  var formlogin = document.getElementById("formlogin");
  formlogin.addEventListener("submit", autentificar, false);

 }

  
  function abrirRegistro(){

   $('#containerlogin').removeClass("d-block");
   $('#containerRegistro').removeClass("d-none");
   $('#containerlogin').addClass("d-none");
   $('#containerRegistro').addClass("d-block");

  }
  function abrirlogin(){

    $('#containerRegistro').removeClass("d-block");
    $('#containerlogin').removeClass("d-none");
    $('#containerRegistro').addClass("d-none");
    $('#containerlogin').addClass("d-block");
   }
  function accesoCuenta(){
    $('#containerlogin').removeClass("d-block");
    $('#containerInicio').removeClass("d-none")
    $('#containerlogin').addClass("d-none");
    $('#containerInicio').addClass("d-block")

  }

 
  function abrirmyperfil(){
    $('#containerInicio').removeClass("d-block");
    $('#containermyperfil').removeClass("d-none")
    $('#containerInicio').addClass("d-none");
    $('#containermyperfil').addClass("d-block")
  }
  function miperfil(){
    $('#containerInicio').removeClass("d-block");
    $('#containermyperfil').removeClass("d-none")
    $('#containerInicio').addClass("d-none");
    $('#containermyperfil').addClass("d-block")

  } 
  function abrirhome(){
    $('#containermyperfil').removeClass("d-block")
    $('#containerInicio').removeClass("d-none");
    $('#containermyperfil').addClass("d-none")
    $('#containerInicio').addClass("d-block");
 
  }
  
   //Subir imagen desde la aplicación
   function addPicture() {
    const ref = firebase.storage().ref();
    const file = document.getElementById("inputGroupFile").files[0];
    const name = file.name;
    let descripcion = document.getElementById("descripcion-image").value;

    if (file == null) {
        alert("Debe seleccionar una imagen");
    }
    else {
      const metadata = {
          contentType: file.type
      }
      const task = ref.child("Datos/"+ name).put(file, metadata);

      task.then(snapshot => snapshot.ref.getDownloadURL()).then( url => {
          // console.log(url);


              db.collection("publications").add({
                  urlPhoto: url,
                  description: descripcion,
                  date: new Date()
              })
              .then(function(docRef) {
                  // console.log("Document written with ID: ", docRef.id);
                //   db.collection("publications").doc(docRef.id).collection("comentarios").add({
                //     userId: id,
                //     comentario: "hello"
                // });
                  
              })
              .catch(function(error) {
                  // console.error("Error adding document: ", error);
              });
          
      })

    }
}

 //Leer publicaciones
 (() => {
  let contentPublicacion = document.getElementById("contentPublicaciones");
  let comentario;
  db.collection("publications").orderBy("date", "desc").onSnapshot(function(querySnapshot) {
      contentPublicacion.innerHTML = '';
      querySnapshot.forEach(function(doc) {
          contentPublicacion.innerHTML += `
          <div class="card-deck mb-5 bg-white border">
          <div class="card bg-white">
              <div class="card-body">
                  <h5 class="card-title" id="usuarioPublicacion">${doc.data().userEmail}</h5>
              </div>
            <div class="imagenPost">
            
            <img src="${doc.data().urlPhoto}" id="" class="card-img-top" alt="..." style="max-width: 100%; width: auto; height: auto;">
            
            </div>
            <div class="card-body">
              <h3 class="card-title"><i class="far fa-heart"></i></h3>
              <p class="card-text" id="">100 Me gusta</p>
              <p class="card-text" id=""><span style="font-weight: bold;">${doc.data().userEmail} </span>${doc.data().description}</p>
              <div class="" style="height:115px; overflow-y: scroll;" id="${doc.id}">
              </div>
              <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            </div>
            <div class="input-group mb-3">
              <input type="text" class="form-control" name="${doc.id}" placeholder="Agregar un comentario..." aria-label="Recipient's username" aria-describedby="button-addon2">
              <div class="input-group-append comentar">
                <button class="btn btn-outline-secondary" type="button" value="${doc.id}" onClick="addComentario()">Publicar</button>
              </div>
            </div>
          </div>
        </div>
          `;
      });
  });
  db.collection("publications").orderBy("date", "desc").onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      let contentComentario = document.getElementById(doc.id);
      db.collection("publications").doc(doc.id).collection("comentarios").orderBy("date", "desc").onSnapshot(function(querySnapshot) {
        contentComentario.innerHTML = '';
        querySnapshot.forEach(function(doc) {
          contentComentario.innerHTML += `<p class="card-text" id=""><span style="font-weight: bold;">${doc.data().userEmail} </span>${doc.data().comentario}</p>`;
          // console.log(doc.data().comentario);
        });
    });
    });
  });
    
})();


  //Cargar publicaciones del usuario
  function verPublicacionUsuario() {
    var user = firebase.auth().currentUser;
    let fotosPerfil = document.getElementById("fotosPerfil");
    
    db.collection("publications").where("userId", "==", user.uid)
    .get()
    .then(function(querySnapshot) {
      fotosPerfil.innerHTML = '';
        querySnapshot.forEach(function(doc) {
          fotosPerfil.innerHTML += `
            <div class="col mb-4 mt-4">
              <div class="card">
                <img src="${doc.data().urlPhoto}" id="${doc.id}" class="imagenPublicacion rounded" alt="..." height="250px" onClick="viewPost()">
                <div class="d-flex justify-content-around pt-2">
                <button type="button" class="btn btn-outline-secondary" value="${doc.id}" data-toggle="modal" data-target="#editarDescripcionPost" onClick="publicacionEditar()" >Editar <i class="far fa-edit"></i></button>
                <button type="button" class="btn btn-outline-danger" value="${doc.id}" data-toggle="modal" data-target="#eliminarPost" onClick="publicacionEliminar()">Eliminar <i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
            `;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    userActivo();
  }

//Cargar publicaciones del usuario
function verPublicacionUsuario() {
  var user = firebase.auth().currentUser;
  let fotosPerfil = document.getElementById("fotosPerfil");
  
  db.collection("publications").where("userId", "==", user.uid)
  .get()
  .then(function(querySnapshot) {
    fotosPerfil.innerHTML = '';
      querySnapshot.forEach(function(doc) {
        fotosPerfil.innerHTML += `
          <div class="col mb-4 mt-4">
            <div class="card">
              <img src="${doc.data().urlPhoto}" id="${doc.id}" class="imagenPublicacion rounded" alt="..." height="250px" onClick="viewPost()">
              <div class="d-flex justify-content-around pt-2">
              <button type="button" class="btn btn-outline-secondary" value="${doc.id}" data-toggle="modal" data-target="#editarDescripcionPost" onClick="publicacionEditar()" >Editar <i class="far fa-edit"></i></button>
              <button type="button" class="btn btn-outline-danger" value="${doc.id}" data-toggle="modal" data-target="#eliminarPost" onClick="publicacionEliminar()">Eliminar <i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
          `;
      });
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
  userActivo();
}

//Editar fotos de perfil
function editProfilePicture() {
  let nombreConfig = document.getElementById("nombreConfig");
  let apellidosConfig = document.getElementById("apellidosConfig");
  let biografiaConfig = document.getElementById("biografiaConfig");

  const ref = firebase.storage().ref();
  const file = document.getElementById("inputFotoPerfil").files[0];
  
    if (nombreConfig.value == ''|| apellidosConfig.value == '') {
      let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Error`;
      mensaje.innerHTML = `El nombre y los apellidos no pueden estar vacios`;
      $("#boxMesanjes").modal('show');
    }
    else if (file == null) {
      var user = firebase.auth().currentUser;
      if (user) {
        db.collection("users").where("userId", "==", user.uid)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            
              db.collection("users").doc(doc.id).update({
                userName: nombreConfig.value,
                userLastName: apellidosConfig.value,
                biography: biografiaConfig.value
            })
            .then(function() {
                
            });
            });
        });
      } else {
        // console.log("No hay usuario");
      }
      let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Exito`;
      mensaje.innerHTML = `Perfil actualizado`;
      $("#boxMesanjes").modal('show');
    }
    else {
      const name = file.name;

      const metadata = {
          contentType: file.type
      }
      const task = ref.child("profile/"+ name).put(file, metadata);

      task.then(snapshot => snapshot.ref.getDownloadURL()).then( url => {

          var user = firebase.auth().currentUser;
          if (user) {
            db.collection("users").where("userId", "==", user.uid)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach(function(doc) {
                
                  db.collection("users").doc(doc.id).update({
                    userName: nombreConfig.value,
                    userLastName: apellidosConfig.value,
                    biography: biografiaConfig.value,
                    photoProfile: url
                })
                .then(function() {
                    console.log("Document successfully updated!");
                });
                });
            });
          } else {
            // console.log("No hay usuario");
          }
      });
      let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Exito`;
      mensaje.innerHTML = `Perfil actualizado`;
      $("#boxMesanjes").modal('show');
      abrirPerfil();
    }
}

//Cambiar contraseña
function newPasswoord() {
  var user = firebase.auth().currentUser;
  let newPassword = document.getElementById("inputPassword2");
  let newPassword2 = document.getElementById("inputPassword3");

  if (newPassword.value == newPassword2.value) {
    user.updatePassword(newPassword.value).then(function() {
      let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Exito`;
      mensaje.innerHTML = `Contraseña actualizada`;
      $("#boxMesanjes").modal('show');
      newPassword.value = '';
      newPassword2.value = '';
      abrirInicio();
    }).catch(function(error) {
      let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Error`;
      mensaje.innerHTML = `La contraseña debe tener numeros y letras`;
      $("#boxMesanjes").modal('show');
    });
  }
  else{
    let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Error`;
      mensaje.innerHTML = `Las contraseñas no coinciden`;
      $("#boxMesanjes").modal('show');
    newPassword.value = '';
    newPassword2.value = '';
    newPassword.focus();
  }
}

//Ver perfil de otro usuario
function viewProfile() {

let userName = document.getElementById("userName");
let biografia = document.getElementById("biografia");
let perfilFoto = document.getElementById("perfilFoto");
let emailUsuario = document.getElementById("correoElectronico");
let perfilBuscar = document.getElementById("buscarUsuario");
let fotosPerfil = document.getElementById("fotosPerfil");

$("#Editar").removeClass("visible");
$("#Editar").addClass("invisible");
perfilFoto.src = ``;
userName.innerHTML =``;
biografia.innerHTML =``;
emailUsuario.innerHTML = ``;
fotosPerfil.innerHTML = ``;

    db.collection("users").where("userEmail", "==", perfilBuscar.value)
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            perfilFoto.src = `${doc.data().photoProfile}`;
            userName.innerHTML =`${doc.data().userName} ${doc.data().userLastName}`;
            biografia.innerHTML =`${doc.data().biography}`;
            emailUsuario.innerHTML = `${doc.data().userEmail}`;
        });
    });

  db.collection("publications").where("userEmail", "==", perfilBuscar.value)
  .get()
  .then(function(querySnapshot) {
    fotosPerfil.innerHTML = '';
      querySnapshot.forEach(function(doc) {
        fotosPerfil.innerHTML += `
          <div class="col mb-4 mt-4">
            <div class="card">
              <img src="${doc.data().urlPhoto}" id="${doc.id}" class="imagenPublicacion" alt="..." height="250px" onClick="viewPost()">
            </div>
          </div>
          `;
      });
  })
  .catch(function(error) {
      // alert("Usuario no existe");
  });
  perfilBuscar.value = '';
}

//Olvide mi contraseña
function olvidePassword() {
let usuarioLogin = document.getElementById("usuarioLogin");
if (usuarioLogin.value == '') {
  let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Error`;
      mensaje.innerHTML = `Debe poner su correo electronico`;
      $("#boxMesanjes").modal('show');
}
else {
  var auth = firebase.auth();

  auth.sendPasswordResetEmail(usuarioLogin.value).then(function() {
    let titulo = document.getElementById("mensajeTitulo");
      let mensaje = document.getElementById("mensaje");
      titulo.innerHTML = `Información`;
      mensaje.innerHTML = `Revise su correo electronico`;
      $("#boxMesanjes").modal('show');
  }).catch(function(error) {
    
  });
}
}

//Comentar
function addComentario() {
var user = firebase.auth().currentUser;
let email = user.email;
let publicacion = event.target.value;
let comentario = document.querySelector("input[name="+publicacion);

if (user) {
    db.collection("publications").doc(publicacion).collection("comentarios").add({
        idPublicacion: publicacion,
        userEmail: email,
        comentario: comentario.value,
        date: new Date()
    });
}
comentario.value= '';   
}

//ver Post Perfil
function viewPost() {
let imagenSeleccionada = event.target.id;
let picturePost = document.getElementById("picturePost");
let usuarioPost = document.getElementById("usuarioPost");
let descripcionPost = document.getElementById("descripcionPost");
let btnComentarPost = document.getElementById("btnComentarPost");
 
db.collection("publications").doc(imagenSeleccionada)
  .get()
  .then(function(doc) {
    btnComentarPost.value = imagenSeleccionada;
    usuarioPost.innerHTML = `${doc.data().userEmail}`;
    descripcionPost.innerHTML = `${doc.data().description}`;
    picturePost.src = `${doc.data().urlPhoto}`;
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });

$("#postPerfil").modal("show");
verComentariosPerfil(imagenSeleccionada);
usuarioPost.innerHTML = ``;
descripcionPost.innerHTML = ``;
picturePost.src = ``;

}

//Ver comentarios Post
function verComentariosPerfil(imagenSeleccionada) {


let comentarioPost = document.getElementById("postComentarios");

db.collection("publications").doc(imagenSeleccionada).collection("comentarios").orderBy("date", "desc")
.get()
.then(function(querySnapshot) {
  comentarioPost.innerHTML = ``;
  querySnapshot.forEach(function(doc) {
    comentarioPost.innerHTML += `<p class="card-text" id=""><span style="font-weight: bold;">${doc.data().userEmail} </span>${doc.data().comentario}</p>`;
  });
});
}

function addComentarioPost() {
var user = firebase.auth().currentUser;
let email = user.email;
let publicacion = event.target.value;
let comentario = document.getElementById("textComentarioPost");

if (user) {
    db.collection("publications").doc(publicacion).collection("comentarios").add({
        idPublicacion: publicacion,
        userEmail: email,
        comentario: comentario.value,
        date: new Date()
    });
}
comentario.value= '';
verComentariosPerfil(publicacion);
}

//Editar publicación
function publicacionEditar() {
let publicacion = event.target.value;
let confirmarActualizar = document.getElementById("actualizarPost");
let descripcionActualizar = document.getElementById("descripcionActualizar");
confirmarActualizar.value = publicacion;
  db.collection("publications").doc(publicacion)
  .get()
  .then(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          descripcionActualizar.value = `${doc.data().description}`;
    });
}

function editarPublicacion() {
let publicacion = event.target.value;
let descripcionActualizar = document.getElementById("descripcionActualizar");

db.collection("publications").doc(publicacion).update({
  description: descripcionActualizar.value
})
.then(function() {
    
});

$("#editarDescripcionPost").modal("hide");
verPublicacionUsuario();
}

//Eliminar foto de perfil
function eliminarFoto() {
var user = firebase.auth().currentUser;

if (user) {
  db.collection("users").where("userId", "==", user.uid)
  .onSnapshot((querySnapshot) => {
      querySnapshot.forEach(function(doc) {
                
        db.collection("users").doc(doc.id).update({
        photoProfile: "https://firebasestorage.googleapis.com/v0/b/instagram-web-97ac0.appspot.com/o/profile%2Fusers.png?alt=media&token=b9f152bf-b00e-4bff-8e8d-a76ce5aab957"
      })
      .then(function() {
        let titulo = document.getElementById("mensajeTitulo");
        let mensaje = document.getElementById("mensaje");
        titulo.innerHTML = `Información`;
        mensaje.innerHTML = `Foto Eliminada`;
        $("#boxMesanjes").modal('show');
      });
      });
  });
} else {
  // console.log("No hay usuario");
}
}

//Eliminar publicación
function publicacionEliminar() {
let publicacion = event.target.value;
let confirmarEliminar = document.getElementById("confirmarEliminar");

confirmarEliminar.value = publicacion;
}

function eliminarPublicacion() {
let publicacion = event.target.value;

db.collection("publications").doc(publicacion).delete().then(function() {
  // console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});

$("#eliminarPost").modal("hide");
verPublicacionUsuario();

}

