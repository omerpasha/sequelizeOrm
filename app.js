const express=require('express');
  const Sequelize=require('sequelize');
    const Playlist=require('./models/playlist');
        const {Op}=Sequelize;

    
    const app=express();
     
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
                
                let {id}=request.params;
                Playlist.findByPk(id).then((playlist) =>{
                    if(playlist){
                        response.json(playlist);
                    } else {
                        response.status(404).send();
                    }
                  
                
                });

        });
          app.listen(8000);