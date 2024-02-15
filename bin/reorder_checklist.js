const yaml = require('js-yaml');
const fs = require('node:fs');

const yaml_filename = 'content/_data/objects.yaml';

// fs.readFile(yaml_filename, 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });

try {
    yaml.loadAll( fs.readFileSync(yaml_filename, 'utf8'), function (doc) {   
    
        doc.object_list.sort(compareByArtistAndTitle);
        //console.log(doc.object_list);

        var order = 401
        doc.object_list.forEach(async (object) => {
            //console.log(object.id+': '+object.title);
            var md_file = 'content/checklist/'+object.id+'.md';
            if (fs.existsSync(md_file)) {
                markdown_lines = fs.readFileSync(md_file, 'utf8').split('\n')
                var yaml_content = ''
                var other_content = ''
                let capture_yaml = false
                markdown_lines.forEach(async (line) => {
                    if( line == '---' ) {
                        if( !capture_yaml ) {
                            capture_yaml = true
                        } else {
                            capture_yaml = false
                        }
                        return
                    }

                    if( capture_yaml ) {
                        yaml_content += line+"\n"
                    } else {
                        other_content += line+"\n"
                    }
                });
                //console.log(yaml_content)
                //console.log(other_content)

                //var md_doc = yaml.load(fs.readFileSync(file, 'utf8'));
                yaml.loadAll(yaml_content, function( md_doc ) {
                    //if( md_doc === null ) return

                    // if( object.id != md_doc.object[0].id ) {
                    //     console.log(object.id+' != '+md_doc.object[0].id)
                    //     console.log(md_doc);
                    //     throw new Error('we have an issue');
                    // }

                    if( md_doc !== null && md_doc.order ) {
                        md_doc.order = order
                        order++

                        if( !md_doc.title ) md_doc.title = object.title+' - '+object.artist
                        md_doc.short_title = " "
                        delete md_doc.artist

                        //if( md_doc.object[0].id === '2023-186-92' ) { 
                            //console.log(md_doc);

                            var content = '---\n';
                            content += yaml.dump(md_doc, {
                                // 'styles': {
                                //   '!!null': 'canonical' // dump null as ~
                                // },
                                'sortKeys': sortOrder
                            })
                            content += '---\n\n';
                            content += other_content;
                            // try {
                            //     fs.writeFileSync(md_file, content);
                            // } catch (err) {
                            //     console.error(err);
                            // }
                            //console.log(content)
                        //}
                        console.log( md_doc.order+' '+md_doc.title )
                    }
                });
            }
        });
        // const doc = yaml.load(fs.readFileSync(yaml_filename, 'utf8'));
        // yaml.dump(object, {
        //     flowLevel: 3,
        //     styles: {
        //         '!!int'  : 'hexadecimal',
        //         '!!null' : 'camelcase'
        //     }
        // });

    });

} catch (e) {
    console.log(e);
}   

/** ************************* FUNCTIONS **************************************/

/**
 * A compare function that compares by artist and then by title 
 */
function compareByArtistAndTitle(a, b) {
    if( a.artist === null ) return 1;
    if( b.artist === null ) return -1;

    let a_last = get_alphabetical_artist_name( a.artist );
    let b_last = get_alphabetical_artist_name( b.artist );

    let artistDiff = a_last.localeCompare(b_last);
    //console.log(artistDiff)

    // If the artists are equal, compare by title
    if (artistDiff === 0) {
        if( a.title === null ) return 1;
        if( b.title === null ) return -1;

        return a.title.localeCompare(b.title)
    }
    
    return artistDiff;
}

/**
 * Get the alphabetical portion of the name for sorting
 */
function get_alphabetical_artist_name( artist ) {
    let artist_sorting = [ 
        'MAD Architects', 
        'Front Design', 
        'Studio Gang', 
        'gt2P (great things to People)', 
        'Nervous System' 
    ];

    if( artist_sorting.includes(artist) ) {
        var artist_last = artist;
    } else {
        var artist_last = artist.split(/[, ]+/).pop();
    }

    return artist_last;
}

/**
 * Sort according to fixed order
 */
function sortOrder( a, b ) {
    fixed_order = [ 'title', 'short_title', 'artist', 'layout', 'presentation', 'object', 'order', 'menu' ]
    return fixed_order.indexOf(a) - fixed_order.indexOf(b);
}