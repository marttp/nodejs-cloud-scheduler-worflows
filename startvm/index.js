const Compute = require('@google-cloud/compute');
const compute = new Compute();

exports.startDevInstance = async (req, res) => {
  try {
    const zone = 'us-central1-a';
    const options = { filter: `labels.env=dev` };
    const [vms] = await compute.getVMs(options);
    let successCount = 0;

    const startedInstances = await Promise.all(
      vms.map(async (instance) => {
        const [operation] = await compute.zone(zone).vm(instance.name).start();
        await operation.promise();
        successCount++;
        return instance.name;
      })
    );

    const message = `Successfully started instances`;
    const responseData = {
      code: 200,
      state: 'started',
      message,
      success: successCount,
      instances: startedInstances,
    };
    console.log(responseData);
    res.status(200).send(responseData);

  } catch (err) {
    console.log(err);
    res.status(500).send({
      code: 500,
      error: err,
    });
  }
};
