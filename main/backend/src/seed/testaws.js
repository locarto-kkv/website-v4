import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";

// EC2 client
const ec2 = new AWS.EC2({
  region: process.env.AWS_REGION, // e.g., "ap-south-1"
});

async function listRunningInstances() {
  try {
    const data = await ec2
      .describeInstances({
        Filters: [
          {
            Name: "instance-state-name",
            Values: ["running"], // only running instances
          },
        ],
      })
      .promise();

    const instances = [];
    data.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        instances.push({
          InstanceId: instance.InstanceId,
          Type: instance.InstanceType,
          State: instance.State.Name,
          PublicIP: instance.PublicIpAddress,
          PrivateIP: instance.PrivateIpAddress,
          LaunchTime: instance.LaunchTime,
        });
      });
    });

    if (instances.length === 0) {
      console.log("⚠️ No running EC2 instances found.");
    } else {
      console.log("✅ Running EC2 Instances:");
      console.table(instances);
    }
  } catch (err) {
    console.error("❌ Error fetching EC2 instances:", err.message);
  }
}

// listRunningInstances();
