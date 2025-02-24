/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { makeRange } from "@components/PluginSettings/components/SettingSliderComponent";
import { Devs } from "@utils/constants";
import { sleep } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { RelationshipStore, RestAPI, UserStore } from "@webpack/common";
import { Message, ReactionEmoji } from "discord-types/general";

interface IMessageCreate {
    type: "MESSAGE_CREATE";
    optimistic: boolean;
    isPushNotification: boolean;
    channelId: string;
    message: Message;
}


const MOYAI = "🗿";
const MOYAI_URL =
    "https://raw.githubusercontent.com/MeguminSama/VencordPlugins/main/plugins/moyai/moyai.mp3";
const MOYAI_URL_HD =
    "https://raw.githubusercontent.com/MeguminSama/VencordPlugins/main/plugins/moyai/moyai_hd.wav";

const settings = definePluginSettings({
    req: {
        description: "Autoreply pattern",
        type: OptionType.STRING,
        default: ''
    },
    res: {
        description: "Respond",
        type: OptionType.STRING,
        default: ''
    }
});

export default definePlugin({
    name: "AutoReplier",
    authors: [Devs.Ven],
    description: "Autoreplier WARNING: This is selfbot eanble at your risk",
    settings,

    flux: {
        async MESSAGE_CREATE({ optimistic, type, message, channelId }: IMessageCreate) {
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (RelationshipStore.isBlocked(message.author?.id)) return;
            if (!message.content) return;
            let p = settings.store.req;
          if (!p)return;
           if (new RegExp(p).test(message.content)){
             RestAPI.post({
               url: `/channels/${message.channelId}/messages`,
               body : {
    "mobile_network_type": "unknown",
    "content": settings.store.res,
    "nonce": `vc-autoreplyselfbot-${Date.now()}`,
    "tts": false,
    "flags": 0

               }
                 
               
             })
           }
        },
    }
});
