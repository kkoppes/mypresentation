import cv2
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.cluster import DBSCAN
import argparse

def apply_log_transformation(image, gamma=2.0):
    c = 255 / np.log(1 + np.max(image))
    log_image = c * (np.log(image + 1))
    return np.array(log_image, dtype=np.uint8)

def isolate_red_dots_full(image, gamma=2.0):
    # Apply log transformation
    log_image = apply_log_transformation(image, gamma=gamma)
    
    # Convert to HSV color space to isolate the red color
    hsv = cv2.cvtColor(log_image, cv2.COLOR_BGR2HSV)
    
    # Define the red color range in HSV
    lower_red = np.array([0, 100, 100])
    upper_red = np.array([10, 255, 255])
    
    # Create a mask for the red color
    mask_red = cv2.inRange(hsv, lower_red, upper_red)
    
    return mask_red

def apply_dbscan(coordinates, eps=5, min_samples=10):
    db = DBSCAN(eps=eps, min_samples=min_samples).fit(coordinates)
    labels = db.labels_
    return labels

def find_cluster_centers(coordinates, labels):
    unique_labels = set(labels)
    cluster_centers = []
    
    for k in unique_labels:
        if k != -1:  # Ignore noise
            class_member_mask = (labels == k)
            cluster_points = coordinates[class_member_mask]
            center = np.mean(cluster_points, axis=0).astype(int)
            cluster_centers.append(center)
    
    return np.array(cluster_centers)

def combine_centers_and_noise(coordinates, labels, cluster_centers):
    noise_points = coordinates[labels == -1]
    combined_points = np.vstack((cluster_centers, noise_points))
    return combined_points

def main(image_path, gamma, eps, min_samples):
    # Load the image
    full_image = cv2.imread(image_path)

    # Apply log transformation to the full image
    log_full_image = apply_log_transformation(full_image, gamma=gamma)

    # Apply the isolation of red dots on the full image
    red_dots_mask = isolate_red_dots_full(full_image, gamma=gamma)

    # Find the locations of the red dots
    red_dots_locations = np.column_stack(np.where(red_dots_mask > 0))

    # Apply DBSCAN to the red dots
    labels_corrected = apply_dbscan(red_dots_locations, eps=eps, min_samples=min_samples)

    # Find the centers of each cluster
    cluster_centers_corrected = find_cluster_centers(red_dots_locations, labels_corrected)

    # Combine cluster centers with noise points
    combined_points_corrected = combine_centers_and_noise(red_dots_locations, labels_corrected, cluster_centers_corrected)

    # Overlay the combined points on the original image
    overlay_combined_corrected = full_image.copy()
    for (y, x) in combined_points_corrected:
        cv2.circle(overlay_combined_corrected, (x, y), 2, (0, 0, 255), -1)

    # Display the overlay of combined points on the original image
    plt.figure(figsize=(10, 10))
    plt.imshow(cv2.cvtColor(overlay_combined_corrected, cv2.COLOR_BGR2RGB))
    plt.title('Overlay of Combined Points on Full Image')
    plt.axis('off')
    plt.show()

    # Create a DataFrame with the coordinates of the combined points
    combined_points_df_corrected = pd.DataFrame(combined_points_corrected, columns=['Y', 'X'])
    import ace_tools as tools; tools.display_dataframe_to_user(name="Combined Points Coordinates", dataframe=combined_points_df_corrected)

    combined_points_df_corrected.head()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process an image to highlight red dots using log transformation and DBSCAN clustering.")
    parser.add_argument('image_path', type=str, help="Path to the input image.")
    parser.add_argument('--gamma', type=float, default=2.0, help="Gamma value for log transformation. Default is 2.0.")
    parser.add_argument('--eps', type=float, default=5.0, help="Epsilon value for DBSCAN clustering. Default is 5.0.")
    parser.add_argument('--min_samples', type=int, default=10, help="Minimum samples for DBSCAN clustering. Default is 10.")
    
    args = parser.parse_args()
    main(args.image_path, args.gamma, args.eps, args.min_samples)
