const express=require('express');
const Sequelize=require('sequelize');
const Playlist=require('./models/playlist');
const Artist=require('./models/artist');
 const Album=require('./models/album');
const Track=require('./models/track');
const {Op}=Sequelize;
const bodyParser=require('body-parser');
    
const app=express();

app.use(bodyParser.json());


            Artist.hasMany(Album,{
                foreignKey:'ArtistId'
            });

            Album.belongsTo(Artist,{
                foreignKey:'ArtistId'
            });

           try{ Playlist.belongsToMany(Track,{
                through:'playlist_track',
                foreignKey:'PlaylistId',
                timestamps:false
            })}catch{
                console.log('from belongsto');
            }
            Track.belongsToMany(Playlist,{
                through:'playlist_track',
                foreignKey:'TrackId',
                timestamps:false
            })

            app.get('/api/playlists',function(request,response){
                    let filter={};
                    let q=request.query.q;
                    if(q){
                        filter={
                            where:{
                                name:{
                                   
                                        [Op.like]:'${q}%'
                                }
                            }
                        };

                    }
                    Playlist.findAll(filter).then((playlists) =>{
                    response.json(playlists);
                    
                    });

            });

            app.get('/api/playlists/:id',function(request,response){
                
                try{
                let {id}=request.params;
                Playlist.findByPk(id,{
                    include:[Track]
                }).then((playlist) =>{
                    if(playlist){
                        response.json(playlist);
                    } else {
                        response.status(404).send();
                    }
                  
                
                });}
                catch{
                    console.log('errorrr!!!!!!!!!');
                }
                
        });

        app.post('/api/artists',function(request,response){
            
          console.log(request.body);
              Artist.create({
                  name:request.body.name
              }).then((artist)=>{
                      response.json(artist);
              },(validation)=>{
                 
                     response.status(422).json({
                         errors:validation.errors.map((error)=>{
                             return{
                                 attribure:error.path,
                                    message:error.message
                             };
                         })
                     });
              });
        });

        app.delete('/api/playlists/:id',function(request,response){
            let{ id }=request.params;
            Playlist.findByPk(id).then((playlist)=>{
                if(playlist){
                        
            return playlist.setTracks([]).then(()=>{
                return playlist.destroy().then(()=>{
                    response.status(204).send();
                         })
                          });
                }else{
                    return Promise.reject();
                }
            }).then(()=>{
                response.status(204).send();
            },()=>{
                    response.status(404).send();
            });
        });

        app.get('/api/tracks/:id',function(request,response){
                
            try{
            let {id}=request.params;
            Track.findByPk(id,{
                include:[Playlist]
            }).then((track) =>{
                if(track){
                    response.json(track);
                } else {
                    response.status(404).send();
                }
              
            
            });}
            catch{
                console.log('errorrr!!!!!!!!!');
            }
            
    });
        app.get('/api/artists/:id',function(request,response){
                
            let {id}=request.params;

            Artist.findByPk(id,{
                include:[Album]
            }).then((artist) =>{
                if(artist){
                    response.json(artist);
                } else {
                    response.status(404).send();
                }
            });
            });

            app.get('/api/albums/:id',function(request,response){
                
                let {id}=request.params;
    
                Album.findByPk(id,{
                    include:[Artist]
                }).then((album) =>{
                    if(album){
                        response.json(album);
                    } else {
                        response.status(404).send();
                    }
                });
                });
        
          app.listen(8000);