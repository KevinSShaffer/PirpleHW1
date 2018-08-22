
const fs = require('fs');
const path = require('path');

const lib = {
    dataDir: path.join(__dirname, '/../.data/'),
    filePath(dir, file) {
        return `${lib.dataDir}${dir}/${file}.json`
    },
    create(dir, file, data, callback) {
        fs.open(this.filePath(dir, file), 'wx', (err, fileDesc) => {
            if (!err && fileDesc) {
                const json = JSON.stringify(data);

                fs.writeFile(fileDesc, json, err => {
                    if (!err) {
                        fs.close(fileDesc, err => {
                            if (!err) {
                                callback(false);
                            } else {
                                callback('Could not close file.');
                            }
                        })
                    } else {
                        callback('Could not write to file.');
                    }
                });
            } else {
                callback('Could not create new file, it may already exist.');
            }
        })
    },
    read(dir, file, callback) {
        fs.readFile(this.filePath(dir, file), 'utf8', (err, data) => {
            callback(err, data);
        });
    },
    update(dir, file, data, callback) {
        fs.open(this.filePath(dir, file), 'r+', (err, fileDesc) => {
            if (!err && fileDesc) {
                const json = JSON.stringify(data);

                fs.truncate(fileDesc, err => {
                    if (!err) {
                        fs.writeFile(fileDesc, json, err => {
                            if (!err) {
                                fs.close(fileDesc, err => {
                                    if (!err) {
                                        callback(false);
                                    } else {
                                        callback('Could not close file.');
                                    }
                                })
                            } else {
                                callback('Could not write to file.');
                            }
                        });
                    } else {
                        callback('Could not truncate file');
                    }
                })
            } else {
                callback('Could not create new file, it may already exist.');
            }
        })
    },
    delete(dir, file, callback) {
        fs.unlink(this.filePath(dir, file), err => {
            callback(err);
        })
    }
};

module.exports = lib;
