
// In July we started receiving audio signals from outside the solar system, and we’ve been studying them since. Posts by Robert Muir.


function Lexicon() {

    //-------------------------------------------------------------------------------------------
    //  TRAVEL
    //-------------------------------------------------------------------------------------------


    this.LexTravel = {
        travel: {
            past: {
                context: ['in some down-time', 'a few weeks ago', 'last week', 'a couple of weeks back', 'last month', 'a few days ago', 'a little while ago', 'a while back', 'recently', 'at the weekend', 'yesterday', 'yesterday afternoon', 'this morning', 'this afternoon', 'on Monday', 'on Tuesday', 'on Wednesday', 'on Thursday', 'on Friday', 'on Saturday', 'on Sunday'],
                travel: ['met with another photographer at', 'met with another cosmologist at', 'met with another astronomer at', 'met with some astro-tourists at', 'helped with a survey at', 'joined a trail at', 'followed a trail at', 'took photos at', 'took some photos near', 'went for a photo walk around', 'took some pictures at', 'took some pictures near', 'did some filming at', 'did some filming near', 'shot some video at', 'did some sketching at', 'did some field recordings at', 'made some sound recordings at', 'spent some time off at', 'drove to', 'drove over to', 'went driving near', 'drove around', 'took a trip to', 'took a trip over to', 'took a trip around', 'went to', 'travelled to', 'visited', 'went hiking at', 'went hiking near', 'went hiking around', 'hiked around', 'went walking at', 'went walking near', 'went walking around', 'walked around', 'went to see'],
                reference: 'I'
            },
            present: {
                context: ['currently', 'right now', 'for a break', 'as a break'],
                travel: ['meeting another photographer at', 'meeting another cosmologist at', 'meeting another astronomer at', 'recording for a podcast at', 'helping with a survey at', 'on the trail at', 'on the trail near', 'spending some time at', 'spending some time near', 'taking some pictures at', 'taking some photos at', 'taking some photos near', 'doing some filming at', 'filming a time-lapse near', 'doing some sketching at', 'making field recordings around', 'recording some audio near', 'driving to', 'driving over to', 'going driving near', 'driving around', 'taking a trip to', 'going to', 'going over to', 'heading to', 'heading over to', 'headed to', 'headed over to', 'on my way to', 'travelling to', 'visiting', 'going hiking at', 'going hiking near', 'going hiking around', 'hiking at', 'hiking near', 'hiking around', 'going walking near', 'going walking around', 'walking near', 'walking around', 'going to see'],
                reference: "I'm"
            },
            future: {
                context: ['in a few days', 'one day next week', 'sometime next week', 'at the weekend', 'tomorrow', 'this afternoon', 'in the morning', 'on Monday', 'on Tuesday', 'on Wednesday', 'on Thursday', 'on Friday', 'on Saturday', 'on Sunday'],
                travel: ['meeting another photographer at', 'meeting some astro-tourists at', 'meeting another cosmologist at', 'meeting another astronomer at', 'helping with a survey at', 'following the trail at', 'following the trail near', 'spending some time at', 'spending some time near', 'taking some pictures at', 'taking some photos at', 'taking some photos near', 'doing some filming at', 'filming a time-lapse near', 'doing some sketching at', 'making field recordings around', 'recording some audio near', 'driving to', 'driving over to', 'going driving near', 'making the drive to', 'making the trip to', 'taking a trip to', 'going to', 'going over to', 'heading to', 'heading over to', 'travelling to', 'visiting', 'going hiking at', 'going hiking near', 'going hiking around', 'hiking at', 'hiking near', 'going walking near', 'going walking around', 'going to see'],
                reference: "I'm"
            }
        },
        places: {
            volcanic: ['Sairecabur', 'the mountain Orbate', 'Zapaleri', 'Juriques', 'Caichinque', 'Chiliques', 'Colachi', 'Lascar', 'the volcano Lascar', 'Acamarachi', 'Aguas Calientes', 'Nevados de Poquis', 'Cerro Chajnantor', 'Cerro Miñiques', 'Cerro Miscanti', 'Cerro Overo', 'Cordón Puntas Negras', 'Pacana Caldera', 'Licancabur & Quimal', 'the surrounding volcanic complex', 'the volcanic range', 'some of the volcanoes', 'some volcanoes in the area', 'a volcanic crater', 'the surrounding craters'],
            salt: ['Soncor', 'Quelana', 'Salar de Tara', 'Salar de Aguas Calientes', 'Salar de Pujsa', 'Salar de Talar', 'Salar de Capur', 'Salar de Atacama', 'Pujsa salt flat', 'Atacama salt flat', 'Capur salt flat', 'Talar flats', 'the salt flats', 'the salt fields', 'the surrounding flats', 'the desert flats', 'some small salt pools'],
            water: ['some of the volcanic lakes', 'San Pedro river', 'Laguna en Salar el Laco', 'Laguna Cejar', 'Laguna Miscanti', 'Laguna Miñiques', 'Laguna Lejía', 'Laguna Verde', 'Laguna Tuyajto', 'Chaxa lagoon', 'the high plain lagoons', 'some Altiplano lagoons', 'the smaller lagoons', 'the surrounding lagoons', 'the salt lakes', 'the surrounding salt lakes'],
            rocky: ['Monturaqui crater', 'Monturaqui meteorite crater', 'Portezuelo del Cajón', 'Paso de Jama', 'Guatin canyon', 'Puritama valley', 'some crater pools in the area', 'some larger craters close-by', 'the Puna slope', 'Quezala canyon', 'the crater pools', 'Valle de la Luna'],
            urban: ['San Pedro', 'Talabre village', 'Toconao', 'Socaire village', 'Pukará de Quitor', 'Tulor', 'Cucuter', 'Coyo', 'Solor', 'Tilomonte camp', 'Machuca village'],
            hills: ['the Altiplano', 'Callejon de Barrales', 'Cordillera de la Sal', 'the Miscanti foothills', 'the Miñiques foothills', 'the Chiliques foothills', 'the Caichinque foothills', "Lascar's foothills"],
            geyser: ['Pozon Rustico', 'Guatin thermal springs', 'Puritama hot springs', 'El Tatio geysers', 'Tatio geysers', 'the local geysers', 'the San Pedro geysers'],
            lava: ['some of the lava flows', 'the lava domes', 'the lava flows', 'the lava fields', 'the tephra fields', 'the lava channels'],
            life: ['Valle de Jere', 'Tilomonte oasis', 'Los Flamencos', 'the national reserve'],
            abandoned: ['Placilla de Caracoles cemetary', 'the abandoned sulfur mines'],
            mines: ['the lithium mines', 'the Atacama lithium fields', 'the copper mines'],
            observatory: ['the ALMA array site', 'the APEX telescope site', 'the NANTEN telescope site', 'the ASTE telescope site']
        },
        comment: {
            witness: {
                a: ['Saw', 'I saw', 'I watched', 'I photographed', 'I sketched', 'I made some drawings of', 'I spotted', 'Was lucky to see', 'I snapped some pics of', 'I got to see', 'Encountered', 'I crossed paths with', 'Came across', 'Spied'],
                b: ['Andean flamingos nearby', 'Chilean flamingos nearby', 'flamingos flying overhead', 'flamingos on the way', 'some flamingos nearby', 'a fox close by', 'another fox there', 'a fox with cubs', 'a hunting fox', 'some playful foxes', 'an Andean fox', 'a Culpeo fox', 'a grey fox', 'llama herds on the way', 'llama being herded', 'some vicuña nearby', 'geese flying overhead', 'geese nearby', 'an eagle overhead', 'soaring eagles', 'a gliding buzzard', 'some distant birds of prey', 'a distant puma', 'a burrowing owl', 'a pair of burrowing owls', 'a family of mouse opossums', 'a mouse opossum nearby', 'a nearby "lava lizard"']
            },
            observation: {
                a: ['The rock formations are', 'The tephra layers are', 'The rock shapes here are', 'The scattered rocks are', 'The stone layers are', 'The salt deposits are', 'The surrounding hills are', 'The plateaus are', 'The clouds here are', 'Even the sand here is', 'The volcanic scars are', 'The lava deposits are', 'The craters are', 'The pyroclasmic channels are', 'The salt crusts are', 'The mineral deposits are', 'The surrounding area is'],
                b: ['striking', 'special', 'pretty special', 'beautiful', 'very unique', 'something to be seen', 'really worth seeing', 'worth witnessing', 'worth checking out', 'very beautiful', 'colorful', 'very colorful', 'otherworldly', 'almost alien', 'really something', 'very photogenic', 'really unique', 'fascinating', 'something else', 'unearthly', 'pretty interesting', 'definitely interesting']
            },
            area: {
                a: ['This whole area', 'The light here', 'This region', 'This whole region', 'This Andean stretch', 'This volcanic cluster', 'The mountain backdrop', 'The backdrop', 'The world here', 'The vision', 'The setting', 'This spot', 'This area', 'This place', 'This bit of Earth', 'This country', 'The land', 'The view', 'The sky', 'The journey', 'This formation', 'The landscape', 'The Atacama', 'The desert', 'This dry desert', 'This ancient fault', 'This mountain desert', 'This land of volcanoes', 'The scale of everything'],
                b: ['is very striking', 'is beautiful', 'is breathtaking', 'can be crushing', 'is always amazing', 'is paralysing', 'can be shattering', 'can feel empty', 'is gentle', 'is calming', 'is ever-changing', 'is special', 'is pretty special', 'is dream-like', 'captures me', 'always floors me', 'is powerful', 'is pretty powerful', 'has a power', 'can possess you', 'can be overwhelming', 'is full of pattern', 'can swallow you up', 'is always surprising', 'can really shrink you', 'can dwarf you', 'seems eternal', 'can consume you', 'is sometimes strange', 'can feel bleak sometimes', 'can make you feel very alone', 'blurs between real and fantasy', 'feels ageless', 'can be overpowering', 'can isolate', 'puts time in perspective', 'is something else', 'is often intense', 'has secrets', 'has seen forgotten things']
            },
            feeling: {
                a: ['I feel', "I'm feeling", "I've been feeling"],
                b: ['like things were simpler before', 'like shit', 'the effect of cabin fever', 'the messages must mean something', 'like I need more breaks', 'like maybe none of this matters', 'these breaks are important', 'I need to be outside', "like I can't fully escape", 'this is just escape', "it's just an escape", 'like this is a dream', 'like none of this is real', 'dizzy again', 'some dizziness', 'the altitude', 'the altitude taking over', 'light-headed from altitude', 'the altitude sickness again', 'short of breath', 'small in this landscape', 'the scale of everything right now', 'the importance of my job', "I can't really escape my work", 'the lack of sleep', 'restless', 'like the only person here sometimes', 'like the world just carries on', 'lucky to be a part of this', 'in the presence of something special', 'dwarfed by these mountains', 'my chest flutter from the altitude', 'something big is happening']
            },
            thinking: {
                a: ['Thinking', "I've been thinking", "I'm thinking", 'I keep thinking', "I can't help but think", 'I think', 'Dreaming', 'I keep dreaming', "I've been dreaming", 'Daydreaming', 'I keep daydreaming'],
                b: ['about home', "that it's all an illusion", 'of contact possibility', "that there's order to the sounds", 'of the messages constantly', 'about the messages', 'about what home means', 'about patterns', 'of other civilisations', 'of life beyond', 'of life out there', "of what's beyond our world", 'of how time can be cruel', 'about where this is going', 'about what the messages mean', 'about what this all means', 'about who they are', "about what they're trying to say", "that we must've got it wrong", "that we've made a mistake", "that maybe we see what we want", 'that we need to reply', 'that there must be others', 'that it must mean something', 'there must be something out there', "it can't be luck"]
            },
            learned: {
                a: ['I also read up on', 'I also learned more about', 'I learned about', "I've read about", 'I read about', 'I remembered hearing about', 'I heard about', "I'd been told about", "Some locals showed me", "A local man told me about", 'A local woman taught me about', "At San Pedro airport they said about", "At Le Paige museum they said about", 'I made some studies of', 'I made some notes about', 'I did some drawings of', 'I took some photos of'],
                b: ['the pyroclastic channels here', 'the tectonic faults', 'the formations nearby', 'the volcanic cracks', 'the tephra layers', 'crystal deposits nearby', 'heritage sites here', 'nearby archaeological sites', 'nearby foxes', 'puma tracks nearby', 'nearby rheas', 'nearby flamingos', 'golden eagles here', 'vultures here', 'condors nearby', 'owls nearby', 'Andean bats here', 'Andean mountain-cat tracks here', 'alpaca in the vicinity', 'vicuña nearby', 'guanaco in the area', 'chinchillas in the area', 'possible huemul tracks', 'possible cougar tracks here', 'regional herbs', 'regional plant-life', 'various succulents here', 'nice cacti in the area', 'colorful lichen here', 'nearby lichen and moss', '"lava lizards" in the area', 'possible Pre-Columbian evidence here', 'possible Atacameño tribe evidence here', 'abandoned mining-town records']
            },
            specific: {
                volcanic: {},
                salt: {},
                water: {},
                rocky: {},
                urban: {},
                hills: {},
                geyser: {},
                lava: {},
                life: {},
                abandoned: {},
                mines: {},
                observatory: {}
            }
        }
    };


    //-------------------------------------------------------------------------------------------
    //  TODAY
    //-------------------------------------------------------------------------------------------


    this.LexToday = {
        time: ['today', 'this morning', 'right now', 'currently', 'recently', 'lately'],
        observation: ['the area', 'the surrounding area', 'the operations site', 'the observatory', 'the Atacama ledge', 'the plateau', 'the plateau region', 'the Atacama', 'the mountain desert here', 'the mountain desert', 'the ridge', 'the range', 'the mountain range', 'the volcanic range', 'the volcanic cluster here', 'the array site', 'the observatory site', 'the facility', "the atmosphere", 'the mood', 'everything here', 'everything'],
        method: ['feels', 'feels relatively', 'seems relatively', 'feels kind of', 'seems kind of', 'seems', 'seems especially', 'feels especially', 'feels fairly', 'seems fairly', 'feels quite', 'seems quite', 'feels very', 'seems very', 'feels a little', 'seems a little', 'feels pretty', 'seems pretty', 'feels really', 'seems really'],
        description: {
            a: ['cold', 'mild', 'fresh'],
            b: ['calm', 'serene', 'quiet', 'tranquil', 'hushed', 'placid', 'still', 'imposing', 'motionless'],
            c: ['empty', 'vacant', 'stark', 'inactive', 'lifeless', 'bleak'],
            d: ['overwhelming', 'dream-like', 'disconnected', 'strange', 'isolated', 'hazy'],
            e: ['slow', 'slow-moving', 'slow-paced', 'sluggish', 'heavy', 'muddy']
        },
        comment: {
            message: {
                a: ['Recent data', 'The latest data', "This morning's data", "Last night's data", "Our latest work", 'Some of our latest work', 'The most recent recording', 'The latest recording', "This morning's recording", "Last night's recording", 'The latest message', 'The last message we received', 'The most recent message', 'The latest message-burst', 'This last message-burst', "This morning's message-burst", "Last night's message-burst", 'Some of the recent audio', 'The latest audio'],
                b: ["isn't really useable", 'has too much noise', 'has a lot of noise', 'is very stuttered', 'is showing interference', 'has some terrestrial interference', 'has some signal inconsistency', 'has some signal issues', 'has some frequency issues', 'is pretty erratic', "can't be used", 'is pretty choppy', 'is inaudible to humans', 'exceeds listening range', 'is pretty distorted', 'has sporadic distortion', 'has too much distortion', 'is clipping a lot', 'is showing some echo', 'has an inconsistent bandwidth', 'is pretty bright', 'is the brightest yet', 'is pretty clear', 'is the clearest yet', 'is very clear sounding', 'is pretty clear sounding', 'is the clearest so far', "is brighter than last week's", 'shows some unique repetition', 'has some repetitions', 'is shorter than previous bursts', 'is longer than previous bursts', 'is low-signal', 'is pretty high-signal', 'is an interesting listen', 'seems identical to a previous set', 'seems similar to a previous set', 'shows a pattern', 'shows interesting patterns', 'has no obvious pattern', 'appears multi-layered', 'appears layered', 'is very low-noise', 'is very low-distortion'],
                pre: {
                    a: ['Been', "I've been", 'Have been'],
                    b: ['listening', 'recording', 'waiting up', 'analysing', 'processing', 'observing', 'watching', 'sweeping', 'evaluating', 'surveying'],
                    c: ['a lot', 'late', 'constantly', 'for hours']
                }
            }
        }
    };


    //-------------------------------------------------------------------------------------------
    //  MESSAGES
    //-------------------------------------------------------------------------------------------


    this.LexMessages = {
        quality: {
            intro: ["it seems like", 'seems like', 'looks like', 'looks as if', 'seems as if', 'it looks like', "it's looking like", 'seems', "we've found that", "we've noticed that", "we've found", "we've noticed", "we're finding", "we're noticing", "one of the contractors spotted that", "one of the contractors noticed that", "Michael noticed that", "Michael pointed out that", "Michael found that", 'I found that', 'I noticed'],
            quantity: ['1 or 2', 'one or two', 'a couple', 'a few', 'several', 'some', 'quite a few', 'a number', 'a handful', 'roughly a third', 'roughly a quarter', 'almost half', 'around half', 'a third', 'a quarter', 'half', 'many', 'most', 'the majority', 'almost all', 'all'],
            preframe: ["last month's", "last week's", "yesterday's", "last night's", "this morning's", 'the latest', 'the recent', 'the newest', 'the newer', 'the more recent'],
            messages: ['messages', 'message-bursts', 'message recordings', 'audio messages', 'recordings', 'sound recordings', 'audio-bursts', 'audio recordings', 'fractured recordings', 'fractured messages', 'truncated recordings', 'audio-data sets', 'data-collections'],
            postframe: ['recently', 'lately', 'from this morning', 'from last night', 'from yesterday', 'from the last few days', 'from the past week', 'tested yesterday', 'tested last week', 'analysed last month', 'analysed last week', 'selected for recent analysis', 'selected for recent study', 'sent to ALMA', 'sent to MIT', 'sent to RLT', 'selected for SETI', 'sent to Hat Creek', 'sent to NASA Langley', 'sent to Berkely', 'sent to Aricebo', 'sent to Green Bank and Parkes', 'sent to Indiana University', 'sent to Stanford', 'sent to Salford', 'sent to Hertfordshire University'],
            display: {
                a: ['show', 'are showing', 'have been showing', 'have shown', 'display', 'are displaying', 'have diplayed', 'are presenting', 'have presented', 'contain', 'have contained', 'include', 'have'],
                b: ['interesting', 'repeating', 'fluctuating', 'jittering', 'sporadic', 'intermittent', 'cyclic', 'sections of', 'periods of', 'moments of', 'periodic', 'continuous', 'reappearing', 'modulating', 'sliding', 'erratic', 'chaotic', 'busy', 'complex', 'complicated', 'subtle', 'fluttering', 'layered', 'noticeable', 'recognisable', 'unexpected', 'familiar', 'clear', 'strong', 'ramped', 'discreet', 'almost-undetectable', 'variable', 'echoing', 'delayed', 'terminal', 'low-level', 'high-level', 'sequential', 'sequences of', 'logical', 'deliberate', 'sweeping', 'percussive', 'punctuating', 'stuttering', 'recursive', 'algorithmic', 'machine-generated'],
                c: ['patterns', 'forms', 'motifs', 'frequency shifts', 'noise pulses', 'dips', 'peaks', 'sustained tones', 'carrier waves', 'pink noise', 'pink noise patterns', 'brown noise', 'perlin noise', 'signal drops', 'bass frequencies', 'phase inversions', 'phase drift', 'pulsing', 'sine-wave droning', 'sine pulses', 'triangle-wave pulses', 'pitch structures', 'pitch interval patterns', 'rumbling', 'harmonics', 'inharmonics', 'partials', 'down-sampling', 'choppiness', 'clipping patterns', 'clicks', 'distortion', 'compression swells', 'frequency swells', 'frequency drift', 'phase oscillation', 'howling', 'low-frequency oscillations', 'infrasound', 'ultrasound', 'permutations'],
                d: ["we've found", "we've seen", "we've noticed", "there's", "we've been finding", "we've been seeing", 'Michael found', 'I found']
            },
            michael: {
                a: ['what Michael calls', 'what Michael referred to as', 'what Michael described as', 'what Michael just referred to as', 'what Michael has started calling', 'what Michael has been calling', "what Michael's notes refer to as", "what Michael has marked as", 'what Michael has listed as'],
                b: ['ballsy', 'special', 'whooshy', 'noisy', 'squelchy', 'devil', 'goblin', 'gremlin', 'ghost', 'llama', 'chinchilla', 'fruity', 'dreamy', 'piercing', 'pigeon', "Putin's", 'possessed', 'Guinea-pig', 'Pikachu', "E.T's", 'machine-gun', 'dinosaur', 'Godzilla', 'sparkly', 'wah-wah', 'T-Pain', "Nixon's", 'distorted'],
                c: ['whistles', 'growls', 'shrieks', 'chirps', 'howls', 'booms', 'clangs', 'drums', 'panpipes', 'flutes', 'screams', 'squeals', 'bongos', 'trumpets', 'gargling', 'gurglings', 'blast-beats', 'rapping', 'maracas', 'beat-boxing', 'wailing', 'sirens', 'coughing', 'washboard', 'cowbell', 'finger-drums', 'break-downs', 'horns', 'vuvuzela', 'screeches', 'barking', 'squawking']
            }
        },
        peaks: {
            intro: ['it seems', 'seems', 'looks like', 'we can see that', 'seems that'],
            type: ['some recent', 'some of the recent', 'several recent', 'a few recent', 'a number of', 'several', 'some', 'some of the'],
            messages: ['messages', 'message-bursts', 'message recordings', 'audio messages', 'recordings', 'sound recordings', 'audio-bursts', 'audio recordings', 'fractured recordings', 'fractured messages', 'truncated recordings', 'audio-data sets', 'data-collections'],
            display: ['share', 'display', 'show', 'have', 'contain'],
            display2: ['consistent', 'the same', 'repeating', 'identical'],
            frequency: ['peaks', 'frequency peaks', 'dips', 'frequency dips', 'missing frequencies', 'boosted frequencies', 'sustained tones', 'droning', 'dips or peaks', 'pre-existing clipping', 'wave-folding'],
            bridge: ['the same', 'identical', 'near-identical', 'very similar', 'similar', 'mirrored', 'inverted', 'continuous', 'connected'],
            property: ['patterns', 'sequences', 'frequency intervals', 'frequency spectra', 'noise distribution', 'gain quotas', 'pitch-spacing', 'formats', 'structures', 'configurations', 'peaks', 'phase', 'sections', 'starting points', 'gaps', 'spaces']
        },
        voices: {
            frame: ['sometimes', 'now and then', 'occasionally', 'some nights', 'at night, sometimes', 'every now and then', 'sometimes, late at night'],
            study: ['while listening', 'when studying messages', 'while studying the audio', "when I'm listening", 'when I listen to the messages', 'when listening alone', 'as I analyse audio', 'as I analyse messages', 'while going over audio', 'while going over data', 'when checking through audio', 'when checking through data', 'when listening to messages', 'while listening through messages', 'while going over messages'],
            think: ['I think', "I'm left feeling like", 'I almost feel that', 'I feel almost convinced', "I feel", "I feel like", 'I convince myself that', 'I start thinking', 'I feel sure that', 'I feel uncertain if', 'I almost start believing that', 'my mind tricks me into believing'],
            hear: ['I can hear the sound of', 'I hear', 'I can hear', 'I can make out', 'I hear the sound of', 'I can faintly make out', 'I can just about hear', 'I can very faintly hear'],
            type: ['distant', 'faded', 'quiet', 'distorted', 'subtle', 'alien', 'angelic', 'terrestrial', 'human', 'familiar', 'comforting', 'ancient', 'forgotten', 'long-forgotten', 'unfamiliar', 'broken-up', 'fragmented', "another world's", 'strange', 'eerie', 'spectral', 'unearthly', 'extra-terrestrial', 'divine', 'mysterious', 'phantom', 'affecting', 'expressive', 'enchanting', 'curious'],
            sound: ['murmurs', 'whispers', 'voices', 'speaking', 'speech', 'singing', 'melodies', 'folk-songs', 'songs', 'music', 'instruments', 'laments', 'echoes', 'languages', 'words', 'talking', 'chanting', 'intonations', 'incantations', 'choirs', 'hushed-tones', 'utterings', 'rumbling', 'rumours', 'reverberations', 'phrases', 'lullabies'],
            noise: ['in the noise', 'in the background']
        },
        update: {
            update: ['update', 'msg update'],
            in: ['over', 'in', 'during'],
            frame: ['the last half hour', 'the last 40 mins', 'the last 45 mins', 'the last 50 mins', 'the last hour', 'the last hour and a half', 'the last 0.5 hrs', 'the last 1.5 hrs'],
            number: ['one', 'two', 'three', 'four', 'five', 'six'],
            confirmed: ['confirmed', 'complete', 'successfully decoded', 'new'],
            messages: ['message', 'audio-burst', 'audio-message'], // manual plural
            truncated: ['truncated message', 'truncated signal', 'broken message', 'interrupted message', 'interrupted signal'],
            unconfirmed: ['unconfirmed', 'yet to be confirmed', 'possible', 'probable', 'likely', 'awaiting follow-up', 'still being processed', 'expected to be confirmed shortly']
        }
    };


    //-------------------------------------------------------------------------------------------
    //  OBSERVATION
    //-------------------------------------------------------------------------------------------


    this.LexObservation = {
        sky: {
            pre: ['while', "when I'm", 'when I find myself'],
            looking: ['watching across', 'studying', 'looking at', 'looking up at', 'looking into', 'looking across', 'staring out at', 'staring up at', 'staring into', 'staring across', 'gazing into', 'gazing up at', 'gazing out at', 'gazing across'],
            way: ['the', 'this'],
            type: ['clear', 'eternal', 'endless', 'crystalline', 'barrelling', 'rolling', 'ever-changing', 'Atacaman', 'Andean', "desert's", 'Chilean', 'uninterrupted', 'slow-moving', 'turning', 'spinning', 'churning', 'cloudless', "plateau's", 'vast', 'open', 'expansive', 'stretching'],
            sky: ['sky', 'skies', 'night', 'night sky', 'night-sky', 'heavens', 'celestial sphere'],

            single: {
                object: ['the backdrop', 'every star', 'each star', 'every planet', 'each star-cluster', 'each distant star', 'every distant star', 'each glowing dot', 'each speck of light', 'each little light', 'the rest of the Milky-Way', 'the observable universe', 'everything', 'everything out there', 'everything far away'],
                seems: ['seems', 'can seem', 'can really seem', 'really seems', 'feels', 'can feel', 'can really feel', 'really feels', 'looks', 'appears']
            },
            plural: {
                object: ['the stars', 'distant stars', 'star-clusters', 'the planets', 'other planets', 'other galaxies', 'the galaxies', 'other star-systems', 'distant star-systems', 'the constellations', 'other worlds', 'distant worlds', 'our cosmic neighbors', 'our galactic neighbors'],
                seems: ['seem', 'can seem', 'can really seem', 'feel', 'can feel', 'can really feel', 'look', 'appear']
            },
            appears: ['bright', 'so bright', 'shining-bright', 'close', 'so close', 'near to me', 'so near', 'within reach', 'painted-on', 'ghostly', 'within touching-distance', 'like a friend', 'like a guide', 'like a guardian', 'like an opportunity', 'like a watcher', 'like a home', 'like a mirror', 'like a puzzle', 'like a trick', 'like a painting', 'like a fantasy', 'like an illusion', 'like an apparition', 'like a dream', 'like family', 'dream-like', 'beckoning', 'beacon-like', 'guide-like', 'inspiring', 'within spitting-distance', "within a stone's throw", 'within grasp', 'burning', 'reachable', 'attainable', 'incredible']
        },
        sighting: {
            just: ['just saw', 'I just saw', 'just noticed', 'just spotted', 'I just spotted', 'just watched', 'I just watched'],
            frame: ['earlier', 'earlier today', 'about an hour ago', 'a couple of hours ago', 'a few hours ago', 'when I got up this morning', 'this morning', 'early this morning', 'at dawn', 'just now', 'a few minutes ago', 'about ten minutes ago', 'about half an hour ago', 'late last night', 'last night', 'yesterday', 'yesterday evening', 'late evening yesterday', 'during a break', 'while I was walking', 'while out walking', 'on my break earlier', 'on a coffee break'],
            saw: ['I saw', 'I noticed', 'I spotted', 'I managed to see', 'I managed to spot', 'I watched', 'I was watching', 'I filmed', 'I was able to spot', 'I was able to see', 'I was able to watch'],
            thing: {
                eagle: {
                    thing: ['an eagle', 'a golden eagle', 'a falcon', 'a hawk', 'a buzzard', 'a condor', 'a vulture', 'some buzzards', 'two eagles'],
                    action: ['gliding', 'swooping', 'soaring', 'flying high', 'flying very high', 'flying very low', 'hunting', 'looking for prey', 'spiraling', 'climbing', 'riding thermals', 'diving']
                },
                fox: {
                    thing: ['a fox', 'an Andean fox', 'a grey fox', 'a Culpeo fox', 'some kind of fox', 'a couple of foxes', 'a pair of foxes', 'some foxes', 'a young fox', 'some young foxes'],
                    action: ['playing', 'stalking', 'hunting', 'making that noise they make', 'running', 'resting', 'sleeping', 'travelling', 'drinking', 'chasing a mouse', 'chasing mice']
                },
                llama: {
                    thing: ['a lone llama', 'a wild llama (guanaco)', 'a fluffly guanaco', 'a colorful guanaco', 'a guanaco fawn', 'a guanaco', 'a guanaco (llama family)', 'a group of guanaco', 'several guanaco', 'a vicuña (wild ancestor of alpaca)', 'a vicuña fawn', 'a vicuña', 'a fluffy vicuña', 'a colorful vicuña', 'a wooly vicuña', 'several vicuña', 'a group of vicuña'],
                    action: ['eating cacti flowers', 'running around', 'travelling', 'wandering', 'licking stones', 'licking rocks for moisture', 'drinking']
                },
                flamingo: {
                    thing: ['several flamingo', 'a group of flamingos', 'a small flock of flamingos', 'a flock of flamingos'],
                    action: ['flying', 'flying west', 'flying north', 'flying high', 'flying low', 'making a lot of noise while flying']
                },
                geese: {
                    thing: ['some geese'],
                    action: ['flying', 'flying west', 'flying north', 'flying high', 'flying low']
                },
                owl: {
                    thing: ['a burrowing owl'],
                    action: ['hopping about', 'kicking up dust', 'drinking from a small pool']
                },
                lizard: {
                    thing: ['a "lava lizard"'],
                    action: ['basking', 'scurrying', 'hopping about', 'looking for insects', 'cooling off']
                },
                chinchilla: {
                    thing: ['a rare chinchilla', 'a southern vizcacha', 'a pair of vizcacha'],
                    action: ['scurrying', 'hopping between rocks', 'burrowing in the dust', 'playing among the stones']
                },
                puma: {
                    thing: ['a rare puma'],
                    action: ['jogging', 'travelling cautiously', 'prowling between rocks']
                },
                dust: {
                    thing: ['a dust plume', 'a small dust devil', 'a dust devil', 'a large dust devil', 'two small dust devils', 'several dust devils', 'three dust devils', 'four small dust devils'],
                    action: ['moving around', 'slowly moving', 'scattering sand', 'almost stationary', 'travelling', 'catching the light', 'swirling', 'moving erratically', 'dancing']
                },
                donkey: {
                    thing: ['a pair of wild donkeys', 'a young wild donkey'],
                    action: ['travelling', 'grazing']
                }
            },
            place: ['outside', 'close by', 'very close by', 'nearby', 'a short distance away', 'by the salt flat', 'close to the observatory', 'close to the operations site', 'at the ridge', 'near the ridge', 'toward the lagoons', 'a little way away', 'in the distance', 'out in the hills', 'towards the volcanoes', 'near the main road', 'over toward Caichinque', 'towards the reserve'],
            remark: []
        },
        light: {
            early: {
                type: ['early', 'low', 'strange', 'scattered', 'Chilean', 'North Chilean', 'growing'],
                light: ['light', 'sunlight', 'morning light', 'sunrise']
            },
            late: {
                type: ['late', 'low', 'strange', 'scattered', 'struggling', 'Chilean', 'North Chilean', 'dwindling', 'falling', 'fading', 'dying'],
                light: ['light', 'dusk', 'sunlight', 'sunset', 'evening light']
            },
            single: {
                thing: ['the Atacama', 'the desert', 'the plain', 'the Andean range', 'the Altiplano', 'Caichinque', 'Chiliques', 'Colachi', 'the volcano Lascar', 'Cerro Miñiques', 'Cerro Miscanti', 'the salt flat', 'the ridge', 'the mountain backdrop', 'the volcanic backdrop', 'the landscape', 'the volcano range', 'the mountain-pass', 'the desert-edge', 'the telescope-site', 'the observatory-site', 'the operations-site'],
                looks: ['looks', 'appears']
            },
            plural: {
                thing: ['the plains', 'the Altiplano slopes', 'the Andes', 'Caichinque & Chiliques', 'the Colachi foothills', "Lascar and it's foothills", 'Miñiques & Miscanti', 'the salt flats', 'the flats', 'the mountains', 'the volcanoes', 'the hills', 'the surrounding hills', 'the surrounding peaks', 'the surrounding rock-faces', 'the lava fields', 'the lagoons', 'the nearby mountains', 'the nearby volcanoes'],
                looks: ['look', 'appear']
            },
            pre: ['subtle', 'bright', 'brilliant', 'soft', 'milky', 'washed-out', 'faded', 'strong', 'glowing', 'eerie', 'deep', 'pale', 'rich', 'powdery'],
            property: ['red', 'orange', 'orange-red', 'amber', 'gold', 'golden-orange', 'yellow', 'turquoise', 'cyan', 'blue', 'royal-blue', 'indigo', 'purple', 'purple-blue', 'mauve', 'pink', 'magenta', 'rose-red'],
            and: ['shimmering', 'hazy', 'clear', 'distant', 'striking', 'beautiful', 'dreamy', 'spectral', 'flickering', 'ghostly', 'ethereal', 'apparitional', 'blissful', 'unworldly']

        }
    };


    //-------------------------------------------------------------------------------------------
    //  TALK
    //-------------------------------------------------------------------------------------------


    this.LexTalk = {
        frame: ['today', 'this afternoon', 'later this afternoon', 'at 6pm', 'this evening', 'tomorrow morning'], // make time based
        me: ["I'll be", "I'm", "we're", "we'll be", 'we are'],
        who: {
            michael: ['Michael', 'Michael Kelper'],
            sara: ['Sara', 'Sara Trigo']
        },
        single: ['is', 'will be', 'is going to be'],
        multiple: ['are', 'will be', 'are going to be'],
        doing: ['doing', 'making', 'giving', 'sharing'],
        talk: ['a talk', 'a presentation', 'a showcase', 'a briefing', 'a seminar', 'a Q&A', 'a conference', 'a run-down', 'a resource-presentation', 'a video presentation'],
        at: ['the ALMA facility', 'ALMA visitor center', 'San Pedro High school', 'Likan-Antai school', 'Solor school', 'the University of Atacama', 'the visitor center', 'VLT', 'Paranal Observatory'],
        our: ['our', 'our recent', 'some of our', 'our early', 'the latest', 'our newest'],
        on: {
            a: ['audio', 'radio', 'unencoding', 'astronomy', 'radio-astronomy'],
            b: ['work', 'findings', 'results', 'studies', 'objectives', 'processes', 'techniques', 'challenges', 'collections', 'tests', 'research','discoveries']
        }
    };


    //-------------------------------------------------------------------------------------------
    //  INTERVIEW
    //-------------------------------------------------------------------------------------------


    this.Interview = {
        show: {
            type: ['radio show', 'radio channel', 'tv show', 'webcast', 'podcast', 'livestream'],
            a: ['Signal', 'Carrier', 'Power', 'Night', 'Brain', 'Rookie', 'Mind', 'Sonic', 'Noise', 'Nylon', 'Stretch', 'Lit', 'Star', 'Sky', 'Input', 'Neon', 'Solar', 'Booster', 'Silent', 'Flashing', 'Fruit', 'Circuit', 'Web', 'New', 'Carbon', 'Live', 'Cloud', 'Sugar', 'Nerd', 'Pure', 'Huge', 'Micro', 'Dark', 'Bright', 'Concrete', 'Mutual', 'Tokyo', 'Chicago', 'Moscow', 'Berlin', 'Johannesburg', 'Santiago', 'Sydney', 'Lazer', 'Steel', 'Amped', 'Factory', 'Underground', 'Hidden', 'Vast', 'Strange', 'Friendship'],
            b: ['Wire', 'Wave', 'Call', 'Blast', 'Flag', 'Work', 'Soup', 'Warp', 'Sling', 'Frenzy', 'City', 'Voice', 'Patrol', 'Twist', 'Blink', 'Launch', 'Pad', 'Wolf', 'Drift', 'Gloss', 'Lens', 'Venus', 'Planet', 'Earth', 'Space', 'Realm', 'Steps', 'Buzz', 'Connection', 'Shadow', 'Shelter', 'Core', 'Complex', 'Gaze', 'Haze', 'Dream', 'Matter', 'Elements', 'Bleep', 'Beam', 'Hype', 'Eon', 'Action', 'Energy', 'Channel', 'Incoming', 'Peak', 'Ether', 'Portal', 'House'],
            c: ['Hour','Weekend', 'Night', 'Weekly', 'Focus', 'Talks', 'Daily']
        },
        past: ['I did an interview with', 'we did an interview with', 'I spoke to', 'Sara did an interview with', 'Sara spoke to', 'Michael did an interview with', 'Michael spoke to'],
        present: ["I'm being interviewed by", "we're being interviewed by", "I'm speaking with", "we're speaking with",'Sara is speaking with', 'Michael is speaking to'],
        short: ["I'll be on", "I'm on", "we'll be on", "we're on", "I'm speaking on", "we're speaking on", 'Sara will be on'],
        preTopic: ["I'll be talking about", "we'll be talking about", 'Sara will be talking about', 'Michael will be talking about'],
        mode: ['Airing', 'Live', 'On', 'Broadcasting'],
        frame: ['tonight', 'this evening', 'at 9pm', 'at 10pm', 'in an hour', '7am tomorrow','8am tomorrow'],
        topic: ['Topic:', 'Subject:', 'Discussing', 'Talking about', 'Looking at'],
        our: ['our', 'our recent', 'some of our', 'our early', 'the latest', 'our newest'],
        on: {
            a: ['audio', 'radio', 'unencoding', 'astronomy', 'radio-astronomy'],
            b: ['work', 'findings', 'results', 'studies', 'objectives', 'processes', 'techniques', 'challenges', 'collections', 'tests', 'research','discoveries']
        },
        on2: {
            a: ['language &', 'interplanetary', 'extrasolar', 'intercivilizational', 'long-range', 'extraterrestrial', 'astronomy &', 'loneliness &', 'isolation &', 'Earth &', 'Time &', 'Space &'],
            b: ['messages', 'communication', 'transmission', 'encounters', 'dialogue', 'beacons', 'signals', 'theory', 'paradoxes', 'challenges', 'barriers', 'understanding', 'travel', 'distance', 'observation', 'evidence', 'expansion', 'colonisation', 'cultures', 'existence']
        }
    };

    this.LexWork = {
        past: {
            who: ["I've", "we've", "Sara's", 'Sara has', "Michael's", 'Michael has', 'Sara and Michael have', 'Sara and I have', 'Michael and I have'],
            frame: ['this shift', 'this watch', 'this session', 'the last few sessions', 'the last few days', 'the last few hours'],
            fix: {
                work: ['working on', 'focusing on', 'working through', 'fixing', 'figuring out', 'trying to fix', 'correcting'],
                single: {
                    a: ['an array calibration', 'an antenna motor', 'a power', 'a decoder', 'a software', 'a signal testing', 'a data transmission', 'a computer', 'a storage', 'a lighting', 'an electrical', 'a network switch', 'an antenna feed', 'a dish pointing', 'a beam former', 'an antenna tracking', 'a dish locking', 'an interference filter'],
                    b: ['issue', 'problem', 'update', 'upgrade', 'glitch', 'bug', 'error', 'failure', 'fault', 'malfunction', 'defect', 'hiccup']
                },
                plural: {
                    a: ['array calibration', 'antenna motor', 'power', 'decoder', 'software', 'signal testing', 'data transmission', 'computer', 'storage', 'lighting', 'electrical', 'network switch', 'antenna feed', 'dish pointing', 'beam former', 'antenna tracking', 'dish locking', 'interference filter'],
                    b: ['issues', 'problems', 'updates', 'upgrades', 'glitches', 'bugs', 'errors', 'failures', 'faults', 'malfunctions', 'defects']
                }
            },
            improve: {
                work: ['doing', 'figuring out', 'working on', 'working though', 'focusing on', 'planning out', 'focused on'],
                single: {
                    a: ['a display', 'an audio', 'a decoder', 'an array calibrator', 'a power', 'a data feed', 'a software', 'a noise reduction', 'a lighting', 'a computer', 'an efficiency', 'a processing', 'an electrical', 'a signal detection', 'a signal verification', 'a network switch', 'an antenna feed', 'a dish pointing', 'a beam former', 'an antenna tracking', 'a dish locking', 'an interference filter'],
                    b: ['revamp', 'modification', 'update', 'upgrade', 'adjustment', 'repair', 'fix', 'mod', 'overhaul']
                },
                plural: {
                    a: ['display', 'audio', 'decoder', 'array calibrator', 'power', 'data feed', 'software', 'noise reduction', 'lighting', 'computer', 'efficiency', 'performance', 'processing', 'electrical', 'signal detection', 'signal verification', 'network switch', 'antenna feed', 'dish pointing', 'beam former', 'antenna tracking', 'dish locking', 'interference filter'],
                    b: ['improvements', 'modifications', 'updates', 'upgrades', 'adjustments', 'repairs', 'fixes', 'mods', 'maintenance']
                }
            }

        },
        present: {
            who: ["I'm", "we're", "Sara's", 'Sara is', "Michael's", 'Michael is', 'Sara and Michael are'],
            work: ['working on', 'planning', 'starting on', 'continuing with']

        },
        comment: {
            been: {
                a: ["Everything's been", 'Things have been', "We've been", "The site's been", "The array's been", "The operations site's been"],
                b: ['pretty', 'fairly', 'a little', 'noticeably', 'surprisingly', 'relatively', 'especially', 'unusually', 'very'],
                c: ['quiet', 'slow', 'busy', 'hectic', 'active', 'sporadic', 'inactive', 'hushed', 'fast-moving', 'slow-moving', 'swamped'],
                d: ['recently', 'lately', 'overall', 'in general']
            },
            activity: {
                a: ["We've been receiving", "We've been having", "We've been logging"],
                b: ['intermittent', 'prolonged', 'an hour of', 'a couple hours of', 'several hours', 'a lot of', 'sporadic', 'regular', 'clustered', 'distorted', 'choppy', 'some quieter', 'some louder', 'some broken', 'some unusable', 'erratic'],
                c: ['signal activity', 'radio events', 'radio activity', 'signal bursts', 'signal activity'],
                d: ['again']
            }

        }
    };


    this.LexAnalysing = {
        a: ['hidden', 'ancient', 'lost', 'concealed', 'coded', 'buried', 'jumbled', 'scrambled', 'glitched', 'broken', 'indecipherable', 'fractured'],
        b: ['secrets', 'words', 'languages', 'songs', 'meanings', 'greetings', 'plans', 'instructions', 'truths', 'conversations', 'connections', 'maps']
    };


    this.Names = {
        a: ['Arturo','Eduardo','Jorge','Pedro','Juan', 'José', 'Patricio', 'Manuel', 'Ramon', 'Luis', 'Luisa', 'Luco', 'Maria', 'Marisa', 'Delia', 'Federico', 'Violetta', 'Emiliano'],
        b: ['Rodriguez', 'Riesco', 'Parra', 'Ortega', 'Montt', 'Marín', 'Letelier', 'Aguirre', 'Cerda', 'Alessandri', 'Palma', 'Alquinta', 'Sanfuentes', 'Andonaegui', 'Balmaceda', 'Fernández', 'Barros', 'Bombal', 'Prieto', 'Enríquez', 'Ibañez']
    };

}

module.exports = Lexicon;