const axios = require('axios');

exports.homeRoutes = async (req, res) => {
    try {
        console.log(process.env.APP_URL);

        const response = await axios.get(`${process.env.APP_URL}/thailottery/api/admin/dashboard`);
        res.render('index', { data: response.data });
    } catch (error) {
        console.error(error);
        res.render('data', { title: 'Data Page', data: [] });
    }
}

exports.userRoutes = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.APP_URL}/thailottery/api/admin/users`);
        console.log(response.data.data);
        res.render('user', { user: response.data.data });
    } catch (error) {
        console.log(error);
        res.render('data', { title: 'Data Page', data: [] });
    }
}

exports.userDetails = async (req, res) => {
    try {

        const response = await axios.get(`${process.env.APP_URL}/thailottery/api/admin/user/${req.params.id}`);

        console.log("response", response.data.data);

        res.render("userdetails", { data: response.data.data });
    } catch (error) {
        console.log(error);
    }
}

exports.allLottries = async (req, res) => {
    try {

        const response = await axios.get(`${process.env.APP_URL}/thailottery/api/admin/lottery/all-lottery`);

        console.log(response.data.data);

        res.render("alllotteries", { data: response.data.data });
    } catch (error) {
        console.log(error);
    }
}



exports.chooseWinner = async (req, res) => {
    try {

        const response = await axios.get(`${process.env.APP_URL}/thailottery/api/admin/lottery/choose-winner`);
        
        console.log(response.data.data);

        res.render("choosewinner", { data: response.data.data });
    } catch (error) {
        console.log(error);
    }
}