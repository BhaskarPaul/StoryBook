const moment = require("moment");

module.exports = {
    formatDate: (date, format) => {
        return moment(date).format(format);
    },
    truncate: (str) => {
        const len = 70;
        let new_str = str.replace(/(<([^>]+)>)/gi, "");
        if (new_str.length > len) {
            new_str = new_str.substr(0, len);
        }
        return new_str + " ... ";
    },
    deleteHtmlTags: (str) => {
        return str.replace(/(<([^>]+)>)/gi, "");
    },
    editIcon: (storyUser, loggedUser, storyId, floating = true) => {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
            } else {
                return `<a href="/stries/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
            }
        } else {
            return "";
        }
    },
    select: (selected, options) => {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp(">" + selected + "</option>"),
                ' selected="selected"$&'
            );
    },
};
