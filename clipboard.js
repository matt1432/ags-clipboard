const { Box, Label, ListBox, Icon, Scrollable, Window } = Widget;
const { exec } = Utils;

const clipboard = exec(`${App.configDir}/clipboard.sh`);


const ClipBoard = () => {
    const list = ListBox();

    const makeItem = (key, val) => {
        console.log(key);
        const widget = val.startsWith('img:') ?
            Icon({
                icon: val.replace('img:', ''),
                size: 200,
            }) :

            Label({
                label: val,
                truncate: 'end',
                max_width_chars: 100,
            });

        list.add(widget);
        list.show_all();
    };

    const decodeItem = (index) => {
        const out = exec([
            'bash', '-c', `cliphist list | grep ${index} | cliphist decode`,
        ]);
        makeItem(index, out);
    };

    clipboard.split('\n').forEach((item) => {
        if (item.includes('img')) {
            makeItem((item.match('[0-9]+') ?? [''])[0], item);
        }
        else {
            decodeItem(item);
        }
    });

    return Window({
        name: 'clipboard',
        child: Scrollable({
            hscroll: 'never',
            vscroll: 'always',
            css: 'min-width: 500px; min-height: 500px;',
            child: Box({
                vertical: true,
                children: [list],
            }),
        }),
    });
};

App.config({
    windows: () => [
        ClipBoard(),
    ],
});