import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { formatTime } from '../../utils/func';
import styles from './styles';
import { FileIcon, defaultStyles } from 'react-native-file-icon';
import { ResizeMode, Video } from 'expo-av';
import { useSelector } from 'react-redux';

/**
 * Message component. This component is used to render a message.
 *
 * @component
 * @param {Object} props - The props for the Message component.
 * @param {Object} props.data - The data for the message.
 * @param {string} props.data.user - The user who sent the message.
 * @param {Date} props.data.dateTimeSend - The time when the message was sent.
 * @param {string} props.data.message - The content of the message.
 * @param {number} props.index - The index of the message.
 * @returns {JSX.Element} The rendered Message component.
 */
export const Message = ({ data, index, localUserID, handleModal, onPress }) => {
   const { name, message, dateTimeSend, isRecalls, imageUser, imageFriend } = data;
   const id = data.sender;
   const friendId = data.receiver;
   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

   return (
      <Pressable onPress={isRecalls ? null : onPress} onLongPress={isRecalls ? null : () => handleModal(data)}>
         <View
            style={[
               styles.container,
               id === localUserID ? { alignSelf: 'flex-end' } : {},
               index === 0 ? { marginBottom: 20 } : {},
            ]}
         >
            {id !== localUserID ? (
               <Image source={{ uri: imageUser ? imageUser : imageFriend }} style={styles.avatar} />
            ) : null}
            {isRecalls ? (
               <View style={[styles.messageContainer, id === localUserID ? { backgroundColor: '#CFF0FF' } : {}]}>
                  {name && id !== localUserID && <Text style={styles.name}>{name}</Text>}
                  <Text style={[styles.content, { color: '#333' }]}>Tin nhắn đã được thu hồi</Text>
                  <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
               </View>
            ) : (
               <>
                  {urlRegex.test(message) ? (
                     /(jpg|jpeg|png|bmp|bmp)$/i.test(message.split('.').pop()) ? (
                        <View>
                           {name && id !== localUserID && <Text style={styles.name}>{name}</Text>}
                           <Image source={{ uri: message }} style={styles.imageMessage} />
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        </View>
                     ) : /(mp4|avi|mkv|mov|wmv|flv|webm)$/i.test(message.split('.').pop()) ? (
                        <View>
                           {name && id !== localUserID && <Text style={styles.name}>{name}</Text>}
                           <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
                              <Video
                                 source={{ uri: message }}
                                 style={styles.imageMessage}
                                 resizeMode={ResizeMode.CONTAIN}
                              />
                           </View>
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        </View>
                     ) : (
                        <View
                           style={[
                              styles.messageContainer,
                              {
                                 width: 150,
                                 height: 200,
                                 justifyContent: 'space-around',
                              },
                           ]}
                        >
                           {name && id !== localUserID && <Text style={styles.name}>{name}</Text>}
                           <View style={{ width: 100, height: 120 }}>
                              <FileIcon
                                 extension={message.split('.').pop()}
                                 {...defaultStyles[message.split('.').pop()]}
                              />
                           </View>
                           <View>
                              {/(m4a|wav|aac|flac|ogg)$/i.test(message.split('.').pop()) ? (
                                 <Text>Tin nhắn thoại</Text>
                              ) : (
                                 <Text>{message.split('--').slice(1)}</Text>
                              )}
                           </View>
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        </View>
                     )
                  ) : (
                     <View style={[styles.messageContainer, id === localUserID ? { backgroundColor: '#CFF0FF' } : {}]}>
                        {name && id !== localUserID && <Text style={styles.name}>{name}</Text>}
                        <Text style={styles.content}>{message}</Text>
                        <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                     </View>
                  )}
               </>
            )}
         </View>
      </Pressable>
   );
};
