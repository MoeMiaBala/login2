import { db } from "../../firebaseConfig";
import {collection, addDoc, updateDoc, doc, increment, serverTimestamp, orderBy, limit, where, getDoc, getDocs, query, arrayUnion} from 'firebase/firestore';

export const addJob = async (jobData) => {
  try {
    const jobCollection = collection(db, 'jobs');
    const docRef = await addDoc(jobCollection, jobData);
    return docRef.id; // Return the new job ID
  } catch (error) {
    throw new Error('Error adding job: ' + error.message);
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const jobDoc = doc(db, 'jobs', jobId);
    await updateDoc(jobDoc, jobData);
  } catch (error) {
    throw new Error('Error updating job: ' + error.message);
  }
};

export const applyForJob = async (userId, jobId) => {
  try {
    // Query the users collection to find the user with the given userId
    //console.log(userId, jobId);
    const usersCollectionRef = collection(db, 'users');
    const userQuery = query(usersCollectionRef, where('uid', '==', userId));
    //console.log(userId);
    
    // Get the user document
    const userQuerySnapshot = await getDocs(userQuery);
    
    if (userQuerySnapshot.empty) {
      throw new Error('User does not exist');
    }
    
    // Assuming userId is unique, you can get the first matching document
    const userDocRef = userQuerySnapshot.docs[0].ref; // Reference to the first user document found

    // Reference to the job document using the jobId directly
    const jobDocRef = doc(db, 'jobs', jobId); // Reference to the job document
    const jobDocSnapshot = await getDoc(jobDocRef); // Get the job document snapshot

    if (!jobDocSnapshot.exists()) {
      throw new Error('Job does not exist');
    }

    // Extract the job title from the job document snapshot
    const jobTitle = jobDocSnapshot.data().jobTitle; // Get job title from the job document

    const userApplicationsCollection = collection(userDocRef, 'applications'); // Reference to the applications subcollection
    const currentDate = new Date();

    const applicationData = {
      jobId: jobId,
      jobTitle: jobTitle, // Use the extracted job title
      status: 'Applied',
      uid: userId,
      userId: userId,
      dateApplied: currentDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }), // e.g., Monday, 12 September 2024
      timeApplied: currentDate.toLocaleTimeString('en-GB', { hour12: false }), // 24-hour format
      timestamp: serverTimestamp(), // Firebase timestamp for sorting if needed
    };

    // Write to the applications collection inside the user's existing document
    await addDoc(userApplicationsCollection, applicationData);
    const applicantsList = jobDocSnapshot.data().applicantsList || [];

    // After successfully adding the application, increment the applicants count for the job
    await updateDoc(jobDocRef, {
      //applicants: increment(1),
      applicants: applicantsList.length + 1,
      applicantsList: arrayUnion(userId),
    });

  } catch (error) {
    throw new Error('Error applying for the job: ' + error.message);
  }
};

export const fetchUserApplications = async (userId) => {
  try {
    // Get a reference to the 'users' collection
    const usersCollectionRef = collection(db, 'users');
    // Query the 'users' collection to find the document with the given userId
    const userQuery = query(usersCollectionRef, where('uid', '==', userId));
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      // Assuming userId is unique and there should be only one result
      const userDoc = userQuerySnapshot.docs[0];
      const applicationsCollectionRef = collection(userDoc.ref, 'applications');
      // Fetch all documents from the applications sub-collection
      const applicationsQuerySnapshot = await getDocs(applicationsCollectionRef);

      // Map through the query snapshot and extract application data
      const applications = applicationsQuerySnapshot.docs.map(doc => ({
        id: doc.id, // Document ID
        ...doc.data() // Spread the rest of the application data
      }));
      return applications; // Return the array of applications

    } else {
      return []; // Return an empty array if no user is found
    }

  } catch (error) {
    console.error("Error fetching user applications:", error);
    return [];
  }
};

export const fetchUserdata = async (user) => {
  try {
    const userId = user.uid; // Fetch current user ID
    const usersCollectionRef = collection(db, 'users'); // Reference to the 'users' collection
    
    // Query the collection to find a document with the matching 'uid' field
    const q = query(usersCollectionRef, where('uid', '==', userId));
    
    const querySnapshot = await getDocs(q); // Fetch matching documents

    if (!querySnapshot.empty) {
      // Assume there's only one document with that UID
      const userDoc = querySnapshot.docs[0]; // Get the first matching document
      const userData = userDoc.data(); // Get the data from the document
      //console.log('User Data:', userData); // Log the data for debugging
      return userData || 'no data'; // Return the tags array, or an empty array if none
    } else {
      console.error('No user document with matching UID found!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user name:', error);
    return [];
  }
};

export const fetchUserData = async (user) => {
  try {
    //console.log("the userrr",user);
    const userId = user; // Fetch current user ID
    const usersCollectionRef = collection(db, 'users'); // Reference to the 'users' collection
    
    // Query the collection to find a document with the matching 'uid' field
    const q = query(usersCollectionRef, where('uid', '==', userId));
    
    const querySnapshot = await getDocs(q); // Fetch matching documents

    if (!querySnapshot.empty) {
      // Assume there's only one document with that UID
      const userDoc = querySnapshot.docs[0]; // Get the first matching document
      const userData = userDoc.data(); // Get the data from the document
      //console.log('User Data:', userData); // Log the data for debugging
      return userData || 'no data'; // Return the tags array, or an empty array if none
    } else {
      console.error('No user document with matching UID found!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user name:', error);
    return [];
  }
};

export const updateUserData = async (uid, userData, image) => {
  try {
    const userRef = doc(db, 'users', uid);

    const dataToUpdate = {
      name: userData.name,
      address: userData.address,
      phoneNumber: userData.phoneNumber,
      jobType: userData.jobType,
      ...(image && { profileImage: image }), // Include profile image if it's not null
    };

    await updateDoc(userRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update profile');
  }
};

export const fetchUserTags = async (user) => {
  try {
    const userId = user.uid; // Fetch current user ID
    const usersCollectionRef = collection(db, 'users'); // Reference to the 'users' collection
    
    // Query the collection to find a document with the matching 'uid' field
    const q = query(usersCollectionRef, where('uid', '==', userId));
    
    const querySnapshot = await getDocs(q); // Fetch matching documents

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Get the first matching document
      const userData = userDoc.data(); // Get the data from the document
      //console.log('User Data:', userData); // Log the data for debugging
      return userData.tags || []; // Return the tags array, or an empty array if none
    } else {
      console.error('No user document with matching UID found!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user tags:', error);
    return [];
  }
};

export const saveTags = async (uid, selectedTags, setModalVisible) => {
  try {
    // Query to find the user document by UID
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('uid', '==', uid)); // Adjust based on your user document structure
    const querySnapshot = await getDocs(userQuery);

    // Check if user exists in the query results
    if (querySnapshot.empty) {
      console.error(`No user found with UID: ${uid}`);
      return; // Exit if user does not exist
    }

    // Assuming there is only one user document per UID
    const userDoc = querySnapshot.docs[0];

    // Update the 'tags' field in user's document with the new selected tags
    await updateDoc(doc(usersRef, userDoc.id), { tags: selectedTags });
    console.log('Tags updated successfully');
    setModalVisible(false)
  } catch (error) {
    console.error('Error updating tags:', error);
  }
};


export const fetchRecommendations = async (userTags, setRecommendedJobs) => {
  try {
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('tags', 'array-contains-any', userTags) // Use userTags from the argument
    );
    
    const jobSnapshot = await getDocs(jobsQuery);
    const jobs = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const randomRecommendations = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
    setRecommendedJobs(randomRecommendations); // Update the state with the recommendations
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};

export const fetchRecentListings = async (userTags, setRecentJobs) => {
  try {
    const recentJobsQuery = query(
      collection(db, 'jobs'),
      where('tags', 'array-contains-any', userTags), 
      orderBy('timestamp', 'desc'),
      limit(5) // Fetch latest 5 jobs
    );

    const jobSnapshot = await getDocs(recentJobsQuery);
    const recentJobs = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecentJobs(recentJobs); // Update the state with recent jobs
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
  }
};

export const fetchJobData = async () => {
  try {
    const jobsSnapshot = await getDocs(collection(db, 'jobs')); // Fetch all jobs
    const jobsList = await Promise.all(
      jobsSnapshot.docs.map(async (doc) => {
        const job = doc.data();
        const employerId = job.employerId;

        const userQuery = query(collection(db, 'users'), where('uid', '==', employerId)); // Adjust 'uid' to the appropriate field
        const userSnapshot = await getDocs(userQuery); // Get the user's document(s)

        const user = !userSnapshot.empty ? userSnapshot.docs[0].data() : {};

        return {
          id: doc.id,
          company: job.companyName,
          location: job.location,
          title: job.jobTitle,
          type: job.jobType,
          salary: job.salary,
          image: user.profileImage ? user.profileImage : require('../images/logo.png'), // Fetch image or fallback
          posted: job.timestamp ? job.timestamp.toDate().toLocaleString('en-GB', {
            year: 'numeric',
            month: 'long', // You can change to 'numeric' for numbers instead of month names
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false // Use 24-hour format
          }) : 'N/A',
          contract: job.jobType,
          description: job.description,
          tags: job.tags,
          employerId: job.employerId
        };
      })
    );

    return jobsList; // Return the jobs list
  } catch (error) {
    throw new Error(`Error fetching job data: ${error.message}`); // Throw error to handle it in the calling component
  }
};

export const fetchTags = async () => {
  try {
    const tagsCollectionRef = collection(db, 'tags'); // Assuming your collection is named 'tags'
    const snapshot = await getDocs(tagsCollectionRef);
    
    const tags = snapshot.docs.map(doc => ({
      ...doc.data() // Spread the rest of the application data
    })); // Adjust based on your tag structure
    //console.log(tags[0].tag);
    return tags[0].tag; // Return the array of tags
  } catch (error) {
    console.error("Error fetching tags: ", error);
    return []; // Return an empty array on error
  }
};

export const handleUpdateJobStatus = async (jobId, setJobPosts, toggleModal, jobPosts) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { status: 'Closed' });
    setJobPosts((prevJobs) => prevJobs.map((job) =>      
      job.id === jobId ? { ...job, status: 'Closed' } : job
    ));
    toggleModal();
    //console.log(jobPosts);
  } catch (error) {
    console.error('Error updating job status:', error);
  }
};