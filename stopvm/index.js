const Compute = require('@google-cloud/compute');
const compute = new Compute();

exports.stopDevInstance = async (req, res) => {
  try {
    const zone = 'us-central1-a';
    const options = { filter: `labels.env=dev` };
    const [vms] = await compute.getVMs(options);
    let successCount = 0;

    const stoppedInstances = await Promise.all(
      vms.map(async (instance) => {
        const [operation] = await compute.zone(zone).vm(instance.name).stop();
        await operation.promise();
        successCount++;
        return instance.name;
      })
    );

    const message = `Successfully stopped instances`;
    const responseData = {
      message,
      state: 'stopped',
      success: successCount,
      instances: stoppedInstances
    };
    
    console.log(responseData);
    res.status(200).send(responseData);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      code: 500,
      error: err
    });
  }
};
