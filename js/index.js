var auth = firebase.auth();
var firestore = firebase.firestore();
var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");
var googleBtn = document.querySelector('.googleBtn');

var googleSignIn = async () => {
  try {
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    var {additionalUserInfo: {isNewUser},user: {displayName,uid, email}} = await firebase.auth().signInWithPopup(googleProvider);
    if (isNewUser) {
      var userInfo = {
        fullName: displayName,
        email,
        createdAt: new Date()
      }
      await firestore.collection('users').doc(uid).set(userInfo);
      console.log("Done")
      // redirect to dashboard 
      location.assign(`./dashboard.html#${uid}`);
    } else {
      console.log(`Welcome ${displayName}`);
      // redirect to dashboard 
      location.assign(`./dashboard.html#${uid}`);
    }
  } catch (error) {
    console.log(error);
  }
}


var signinFormSubmission = async (e) => {
  e.preventDefault();
  try {
    var email = document.querySelector(".signinEmail").value;
    var password = document.querySelector(".signinPassword").value;
    if (email && password) {
      // Login User
      var {user: {uid}} = await auth.signInWithEmailAndPassword(email, password);
      // fetch user info
      var userInfo = await firestore.collection('users').doc(uid).get();
      console.log(userInfo.data());
      // redirect to dashboard 
      location.assign(`./dashboard.html#${uid}`);
    }
  } catch (error) {
    console.log(error);
  }
};

var signupFormSubmission = async (e) => {
  e.preventDefault();
  try {
    var fullName = document.querySelector(".signupFullName").value;
    var email = document.querySelector(".signupEmail").value;
    var password = document.querySelector(".signupPassword").value;
    if (fullName && email && password) {
      var {user: {uid}} = await auth.createUserWithEmailAndPassword(email, password);
      // store user data in firestore database
      var userInfo = {
        fullName,
        email,
        createdAt: new Date()
      }
      // console.log(userInfo)
      await firestore.collection('users').doc(uid).set(userInfo);
      // redirect to dashboard 
      location.assign(`./dashboard.html#${uid}`);
    }
  } catch (error) {
    console.log(error);
  }
};

signinForm.addEventListener("submit", (e) => signinFormSubmission(e));
signupForm.addEventListener("submit", (e) => signupFormSubmission(e));
googleBtn.addEventListener('click', googleSignIn);
