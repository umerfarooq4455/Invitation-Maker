// const handleFileChange = async (
//     event: React.ChangeEvent<HTMLInputElement>,
//     type: string
//   ) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       const filePreview = URL.createObjectURL(file);
//       // Create a FormData object for file upload
//       const formData = new FormData();
//       formData.append('file', file);

//       try {
//         // Upload the file to the server
//         const response = await fetch(
//           'https://collage-maker.trippleapps.com/file/upload/',
//           {
//             method: 'POST',
//             body: formData,
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log(data.results.file_path);

//           const fileURL = data.results.file_path;

//           // Update the state with the new file URL
//           if (type === 'frame') {
//             // setSelectedFrameFile(file);
//             fileURL.preview = filePreview;
//             setFormData((prevData) => ({
//               ...prevData,
//               templateFrameURL: fileURL,
//             }));
//           } else if (type === 'thumbnail') {
//             // setSelectedThumbnailFile(file);
//             fileURL.preview = filePreview;
//             setFormData((prevData) => ({
//               ...prevData,
//               templateThumbnailURL: fileURL,
//             }));
//           }
//         } else {
//           console.error('File upload failed', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error uploading file', error);
//       }
//     }
//   };