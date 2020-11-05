module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if(username.trim() === '') {
        errors.username = 'ユーザー名は必須項目です！'
    }
    if(email.trim() === '') {
        errors.email = 'Eメールは必須項目です！'
    } else {
        const regEx =  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
        if(!email.match(regEx)) {
            errors.email = '無効なメールアドレスです！'
        }
    }
    if(password === '') {
        errors.password = 'パスワードは必須項目です！'
    } else if(password !== confirmPassword) {
        errors.confirmPassword = 'パスワードが一致しません！'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if(username.trim() === '') {
        errors.username = 'ユーザー名は必須項目です！'
    }
    if(password.trim() === '') {
        errors.email = 'パスワードは必須項目です！'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
};