const axios = require('axios');
const qs = require('qs');
const token = 'YOUR_ACCESS_TOKEN';
const lineNotifyUrl = 'https://notify-api.line.me/api/notify';
exports.lineNotifyToDevGroup = async (req, res) => {
  try {
    const { state } = req.body;
    let message = '';
    switch (state) {
      case 'started':
        message = 'Server ทำงานแล้ว เริ่มงานได้แล้วจ้า';
        break;
      case 'stopped':
        message = 'Server stop แล้วนะ กลับบ้านกันเถอะ';
        break;
      default:
        message = 'Functions Start/Stop ทำงานผิดพลาดรึเปล่าครับ?';
        break;
    }

    const data = qs.stringify({ message });

    const config = {
      method: 'post',
      url: lineNotifyUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    await axios(config);
    console.log('Notify Success');

    res.status(204).send();
  } catch (err) {
    console.log('Notify Error!');
    console.log(err);
    res.status(500).send(err);
  }
};
