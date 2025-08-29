// import { View, Text, StyleSheet, Pressable } from "react-native";
// import { Image } from "expo-image";
// import { Ionicons } from "@expo/vector-icons";
// import { formatCurrency } from "@/lib/helpers";

// type TaskProps = {
//   title: string;
//   description: string;
//   incentive: number;
//   location: string;
//   imageUrl?: string;
//   postedBy: string;
//   postedAt: string;
//   onPress: () => void;
// };

// export default function TaskCard({
//   title,
//   description,
//   incentive,
//   location,
//   imageUrl,
//   postedBy,
//   postedAt,
//   onPress,
// }: TaskProps) {
//   return (
//     <Pressable style={styles.container} onPress={onPress}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>{title}</Text>
//             <View style={styles.incentiveContainer}>
//               <Text style={styles.incentiveLabel}>Reward</Text>
//               <Text style={styles.incentive}>{formatCurrency(incentive)}</Text>
//             </View>
//           </View>
//         </View>

//         <Text style={styles.description} numberOfLines={2}>
//           {description}
//         </Text>

//         <View style={styles.imageContainer}>
//           {imageUrl && (
//             <Image
//               source={{ uri: imageUrl }}
//               style={styles.image}
//               contentFit="cover"
//               transition={200}
//             />
//           )}
//         </View>

//         <View style={styles.footer}>
//           <View style={styles.locationContainer}>
//             <Ionicons name="location" size={16} color="#666" />
//             <Text style={styles.location}>{location}</Text>
//           </View>
//           <View style={styles.postedContainer}>
//             <Text style={styles.postedBy}>Posted by {postedBy}</Text>
//             <Text style={styles.postedAt}>{postedAt}</Text>
//           </View>
//         </View>
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: "#f0f0f0",
//   },
//   content: {
//     padding: 16,
//   },
//   header: {
//     marginBottom: 12,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     flex: 1,
//     marginRight: 12,
//   },
//   incentiveContainer: {
//     backgroundColor: "#dcfce7",
//     padding: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   incentiveLabel: {
//     fontSize: 12,
//     color: "#22C55E",
//     fontWeight: "500",
//   },
//   incentive: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#22C55E",
//   },
//   description: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   imageContainer: {
//     marginBottom: 12,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 12,
//   },
//   footer: {
//     flexDirection: "column",
//     gap: 8,
//   },
//   locationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     alignSelf: "flex-start",
//   },
//   location: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 4,
//   },
//   postedContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     paddingTop: 8,
//   },
//   postedBy: {
//     fontSize: 12,
//     color: "#666",
//   },
//   postedAt: {
//     fontSize: 12,
//     color: "#999",
//   },
// });

import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/lib/helpers";

type TaskProps = {
  title: string;
  description: string;
  incentive: number;
  location: string;
  imageUrl?: string;
  postedBy: string;
  postedAt: string;
  onPress: () => void;
};

export default function TaskCard({
  title,
  description,
  incentive,
  location,
  imageUrl,
  postedBy,
  postedAt,
  onPress,
}: TaskProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.incentiveContainer}>
              {/* <Text style={styles.incentiveLabel}>Reward</Text> */}
              <Text style={styles.incentive}>{formatCurrency(incentive)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* <View style={styles.imageContainer}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          )}
        </View> */}

        <View style={styles.footer}>
          {/* <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{location}</Text>
          </View> */}
          <View style={styles.postedContainer}>
            <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.location}>{location}</Text>
          </View>
            <Text style={styles.postedBy}>Posted by {postedBy}</Text>
            <Text style={styles.postedAt}>{postedAt}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  content: {
    padding: 14,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 12,
  },
  incentiveContainer: {
    backgroundColor: "#dcfce7",
    padding: 3,
    borderRadius: 8,
    alignItems: "center",
  },
  incentiveLabel: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "500",
  },
  incentive: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#22C55E",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  footer: {
    flexDirection: "column",
    gap: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  postedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  postedBy: {
    fontSize: 12,
    color: "#666",
  },
  postedAt: {
    fontSize: 12,
    color: "#999",
  },
});
