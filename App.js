import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SectionList,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.75, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setImageUri(data.uri);
      setCameraVisible(false);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please capture an image first!");
      return;
    }
    setIsLoading(true);
    let formData = new FormData();
    formData.append("photo", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    try {
      const response = await fetch(
        "https://n0wxtn1d-5000.inc1.devtunnels.ms/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      Alert.alert(
        "Upload Success",
        `Image uploaded successfully!\nPrediction: ${
          data.predicted_label === 1 ? "Cancer Detected" : "No Cancer Detected"
        }`
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Upload Error", error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedId(selectedId === id ? null : id);
  };

  const FAQData = [
    {
      title: "How does the app work?",
      data: [
        "The app utilizes artificial intelligence and image recognition technology to analyze images of skin lesions or moles uploaded by users. It identifies patterns and characteristics associated with skin cancer, such as asymmetry, irregular borders, color variation, and changes in size.",
      ],
    },
    {
      title: "What signs of skin cancer does the app detect?",
      data: [
        "The app is designed to detect various signs of skin cancer, including melanoma, basal cell carcinoma, and squamous cell carcinoma. It assesses factors such as asymmetry, border irregularity, color variation, and diameter (ABCD criteria) to identify potentially concerning lesions.",
      ],
    },
    {
      title: "Is the app suitable for self-diagnosis?",
      data: [
        "While the app can provide valuable insights and aid in early detection, it is not intended for self-diagnosis. Users are encouraged to use the app as a tool for monitoring and tracking changes in their skin, and to consult a healthcare professional for a comprehensive evaluation and diagnosis.",
      ],
    },
    {
      title: "How should users use the app effectively?",
      data: [
        "To use the app effectively, users should ensure they have a clear and well-lit image of the skin lesion or mole they want to analyze. They should position the camera directly above the lesion and capture multiple angles if possible. Images should be uploaded to the app for analysis, and users should follow any prompts or instructions provided.",
      ],
    },
    {
      title: "What should users do if the app detects a potential issue?",
      data: [
        "If the app identifies a potentially concerning lesion, users should not panic. Instead, they should make an appointment to see a dermatologist or other qualified healthcare professional for further evaluation and diagnosis. Early detection is key to successful treatment of skin cancer.",
      ],
    },
    {
      title: "Is user data secure and private?",
      data: [
        "User data security and privacy are top priorities for us. We adhere to strict privacy policies and use encryption protocols to safeguard user data. Personal information is kept confidential and is only used for the intended purpose of skin cancer detection.",
      ],
    },
    {
      title: "Is the app available for all Android devices?",
      data: [
        "Yes, the app is compatible with most Android devices running Android OS version 5.0 (Lollipop) and above. It is optimized for both smartphones and tablets.",
      ],
    },
    {
      title: "Are there any limitations to the app's capabilities?",
      data: [
        "While the app is highly accurate in detecting potential signs of skin cancer, there are certain limitations to its capabilities. Factors such as image quality, skin type, and the presence of other skin conditions may affect the app's accuracy. Additionally, the app is not able to provide a definitive diagnosis and should be used in conjunction with professional medical advice and diagnosis.",
      ],
    },
    {
      title:
        "How frequently should users use the app for skin cancer detection?",
      data: [
        "Users are encouraged to use the app regularly to monitor changes in their skin over time. It's recommended to perform self-examinations at least once a month and to use the app to track any new or evolving lesions.",
      ],
    },
    {
      title: "Can the app detect skin cancer in all skin types and tones?",
      data: [
        "While the app is designed to detect skin cancer across various skin types and tones, it may have limitations in accurately analyzing certain skin characteristics, such as pigmentation. Users with darker skin tones are advised to consult a dermatologist for a comprehensive evaluation if they have concerns about specific skin lesions.",
      ],
    },
  ];

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      {cameraVisible ? (
        <Camera style={styles.fullScreenCamera} ref={cameraRef}>
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCapture}>
              <Text style={styles.buttonText}>Snap</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <>
          <Text style={styles.title}>Skin Cancer Detection</Text>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.homeScreen}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Capture an Image</Text>
                </View>
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { marginRight: 10 }]}
                  onPress={() => setCameraVisible(true)}
                >
                  <Text style={styles.buttonText}>Capture</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                  <Text style={styles.buttonText}>Check</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.faqTitle}>FAQs</Text>
            <SectionList
              sections={FAQData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, section }) => {
                if (selectedId === section.title) {
                  return (
                    <View style={styles.answerContainer}>
                      <Text style={styles.answer}>{item}</Text>
                    </View>
                  );
                }
                return null;
              }}
              renderSectionHeader={({ section }) => (
                <TouchableOpacity onPress={() => toggleExpand(section.title)}>
                  <View style={styles.header}>
                    <Text style={styles.headerText}>{section.title}</Text>
                    <AntDesign
                      name={selectedId === section.title ? "up" : "down"}
                      size={16}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.end} />
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fullScreenCamera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  cameraButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
  scrollView: {
    width: "100%",
    marginTop: 100,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  homeScreen: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  previewImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  placeholder: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    color: "#a9a9a9",
    fontSize: 18,
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  faqTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fcfcfc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
  answerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fcfcfc",
  },
  answer: {
    fontSize: 14,
    color: "#333",
  },
  end: {
    padding: 16,
  },
});
