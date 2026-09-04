// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// import { auth, db } from "../config/firebase";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [adminProfile, setAdminProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       async (firebaseUser) => {
//         try {
//           if (firebaseUser) {
//             // Check if this Firebase user is an admin
//             const adminRef = doc(
//               db,
//               "admins",
//               firebaseUser.uid,
//             );

//             const adminSnap = await getDoc(adminRef);

//             if (adminSnap.exists()) {
//               setUser(firebaseUser);
//               setAdminProfile(adminSnap.data());
//             } else {
//               // User authenticated but is not registered as admin
//               setUser(null);
//               setAdminProfile(null);
//             }
//           } else {
//             setUser(null);
//             setAdminProfile(null);
//           }
//         } catch (error) {
//           console.error(
//             "Error checking authentication:",
//             error,
//           );

//           setUser(null);
//           setAdminProfile(null);
//         } finally {
//           setLoading(false);
//         }
//       },
//     );

//     return () => unsubscribe();
//   }, []);

//   async function logout() {
//     try {
//       await signOut(auth);

//       setUser(null);
//       setAdminProfile(null);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   }

//   const isAdmin = Boolean(user && adminProfile);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         adminProfile,
//         isAdmin,
//         loading,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }