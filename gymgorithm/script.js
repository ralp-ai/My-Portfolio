// Make sure you have these Firebase imports at the top of your file
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  
  // Initialize Firebase services
  const auth = getAuth();
  const db = getFirestore();
  
  // Get Started Button
  document.querySelector(".btn")?.addEventListener("click", function() {
      alert("Welcome to Gymgorithm! Feature coming soon.");
  });
  
  // Login Form
  document.getElementById("loginForm")?.addEventListener("submit", function(event) {
      event.preventDefault();
  
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
  
      signInWithEmailAndPassword(auth, email, password)
          .then(() => {
              window.location.href = "dashboard.html";
          })
          .catch(error => {
              alert(error.message);
          });
  });
  
  // Signup Form
  document.getElementById("signupForm")?.addEventListener("submit", async function(event) {
      event.preventDefault();
  
      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let confirmPassword = document.getElementById("confirmPassword").value;
  
      if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
      }
  
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await setDoc(doc(db, "users", user.uid), {
              name: name,
              email: email,
              joined: new Date(),
              profile: {
                  age: null,
                  gender: null,
                  weight: null,
                  height: null
              }
          });
          
          alert("Account created successfully!");
          window.location.href = "dashboard.html";
      } catch (error) {
          alert(error.message);
      }
  });
  
  // Auth State Listener
  onAuthStateChanged(auth, async (user) => {
      if (user) {
          try {
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists()) {
                  const userData = userDoc.data();
                  document.getElementById("username").textContent = userData.name;
                  
                  // Load profile data if it exists
                  if (userData.profile) {
                      document.getElementById("profile-age").value = userData.profile.age || '';
                      document.getElementById("profile-gender").value = userData.profile.gender || '';
                      document.getElementById("profile-weight").value = userData.profile.weight || '';
                      document.getElementById("profile-height").value = userData.profile.height || '';
                  }
              }
          } catch (error) {
              console.error("Error loading user data:", error);
          }
      } else {
          window.location.href = "login.html";
      }
  });
  
  // Profile Modal Handling
  const profileModal = document.getElementById('profile-modal');
  const profileForm = document.getElementById('profile-form');
  const userProfile = document.getElementById('user-profile');
  
  if (userProfile) {
      userProfile.addEventListener('click', () => {
          profileModal.style.display = 'block';
      });
  }
  
  if (profileModal) {
      document.querySelector('.close')?.addEventListener('click', () => {
          profileModal.style.display = 'none';
      });
  
      window.addEventListener('click', (e) => {
          if (e.target === profileModal) {
              profileModal.style.display = 'none';
          }
      });
  }
  
  if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const userId = auth.currentUser?.uid;
          if (!userId) return;
  
          const profileData = {
              age: parseInt(document.getElementById('profile-age').value) || null,
              gender: document.getElementById('profile-gender').value || null,
              weight: parseFloat(document.getElementById('profile-weight').value) || null,
              height: parseInt(document.getElementById('profile-height').value) || null,
              lastUpdated: new Date()
          };
  
          try {
              await updateDoc(doc(db, 'users', userId), {
                  profile: profileData
              });
              
              profileModal.style.display = 'none';
              alert('Profile updated successfully!');
          } catch (error) {
              console.error('Error updating profile:', error);
              alert('Failed to update profile. Please try again.');
          }
      });
  }

  // Handle signup
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const profileForm = document.getElementById('profileForm');
  
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Redirect to profile setup
            window.location.href = 'profile.html';
          })
          .catch((error) => {
            alert(error.message);
          });
      });
    }
  
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
  
          const userData = {
            fullName: document.getElementById('fullName').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            weight: parseFloat(document.getElementById('weight').value),
            height: parseFloat(document.getElementById('height').value),
            fitnessGoals: document.getElementById('fitnessGoals').value,
            role: "user", // default role
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          };
  
          db.collection("users").doc(uid).set(userData)
            .then(() => {
              alert("Profile saved!");
              // redirect to dashboard
            })
            .catch((error) => {
              console.error("Error saving profile: ", error);
            });
        } else {
          alert("User not logged in");
        }
      });
    }
  });
  
  import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from './firebase-config.js';

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    alert("You're not logged in.");
    return;
  }

  // Show spinner
  spinner.style.display = 'inline-block';
  buttonText.textContent = 'Saving...';

  const fullName = document.getElementById('fullName').value.trim();
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const activityLevel = document.getElementById('activityLevel').value;
  const fitnessGoals = document.getElementById('fitnessGoals').value;
  const experienceLevel = document.getElementById('experienceLevel').value;
  const workoutDays = Array.from(document.querySelectorAll('input[name="workoutDays"]:checked')).map(cb => cb.value);

  const profileData = {
    fullName,
    age,
    gender,
    weight,
    height,
    activityLevel,
    fitnessGoals,
    experienceLevel,
    workoutDays,
    completed: true,
    timestamp: new Date()
  };

  try {
    await setDoc(doc(db, "users", currentUser.uid), profileData, { merge: true });
    alert("Profile saved successfully!");
    // Optionally redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Error saving profile:", err);
    alert("Failed to save profile. Please try again.");
  } finally {
    spinner.style.display = 'none';
    buttonText.textContent = 'Complete Profile';
  }
});
